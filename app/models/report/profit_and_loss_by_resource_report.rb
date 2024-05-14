# == Schema Information
#
# Table name: profit_and_loss_by_resource
#
#  id              :bigint(8)        not null, primary key
#  start_date      :date
#  end_date        :date
#  data            :jsonb
#  organization_id :bigint(8)
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#
# Indexes
#
#  index_profit_and_loss_by_resource_on_organization_id  (organization_id)
#
# Foreign Keys
#
#  fk_rails_...  (organization_id => organizations.id)
#

class Report::ProfitAndLossByResourceReport < ApplicationRecord
  include Reports::Reportable
  include Reports::MaterializedAccountFundReportable
  include Reports::ProfitAndLossReportable
  include Reports::ResourceReportable

  # NOTE: Tablename is too long if normally namespaced
  self.table_name = "profit_and_loss_by_resource"

  # CALLBACKS
  #-----------------------------------------------------------------------------
  before_create :set_defaults
  after_create :run_report

  # RELATIONSHIPS
  #-----------------------------------------------------------------------------
  belongs_to :organization

  delegate :name, :id, to: :organization, prefix: true
  store_accessor  :data, :account_search_params, :reports

  Categories = {
    revenues: {
      "8010-8099": "LCFF Sources",
      "8100-8299": "Federal Revenue",
      "8300-8599": "Other State Revenue",
      "8600-8799": "Other Local Revenue"
    },
    expenses: {
      "1000-1999": "Certificated Salaries",
      "2000-2999": "Classified Salaries",
      "3000-3999": "Employee Benefits",
      "4000-4999": "Books and Supplies",
      "5000-5999": "Services and Other Operating Expenses",
      "6000-6999": "Depreciation",
      "7100-7299,7400-7499": "Other Outgo (excluding Transfers of Indirect Costs)",
      "7300-7399": "Other Outgo - Transfers of Indirect Costs"
    },
    other_financing: {
      "8900-8929": "Transfers In",
      "7600-7629": "Transfers Out",
      "8930-8979": "Sources",
      "7630-7699": "Uses",
      "8980-8999": "Contributions"
    }
  }.freeze

  def subtitle
    "Profit and Loss Statement by Resource"
  end

  def run_report(_should_save=true)
    self.data ||= {}
    self.account_search_params = account_search_params&.symbolize_keys

    normalize_data!

    setup do
      data[:fiscal_year] = FiscalYear.get_year(end_date).year
      data[:report_date] = Date.today.to_formatted_s(:std)

      data[:reports] = {}

      # Cache codes to avoid db lookups
      @unrestricted_codes = unrestricted_resources.map(&:code)
      @restricted_codes   = restricted_resources.map(&:code)
      @resource_codes     = @unrestricted_codes + @restricted_codes

      # Set up Table Views and Accessor Classes
      setup_accounts_view
      setup_entry_items_view
      setup_totals_view
      setup_local_classes

      @fund_codes = data[:account_funds].pluck(:code)
      @default_row = [*unrestricted_resources.map {|res|
                        [res.code, "$0.00"]
                      }, ["unrestricted", "$0.00"], *restricted_resources.map {|res|
                                                      [res.code, "$0.00"]
                                                    }, ["restricted", "$0.00"], ["balance", "$0.00"]].to_h.freeze

      data[:account_elements] = data[:account_search_params]
    end

    data[:titles] = [*@unrestricted_codes, :unrestricted, *@restricted_codes, :restricted]
    data[:unrestricted_codes] = @unrestricted_codes
    data[:restricted_codes] = @restricted_codes

    data[:reports][:all] = run_sheet(@fund_codes)
    if @fund_codes.length > 1
      @fund_codes.each do |fund_code|
        data[:reports][fund_code.to_sym] = run_sheet([fund_code])
      end
    end

    # Cleanup
    drop_views
    save

    self
  end

  def run_sheet(fund_codes)
    report = {}

    Report::ProfitAndLossStatement::Categories.each do |category_type, obj|
      report[category_type] = {}

      obj.each do |range, title|
        account_range = parse_account_range(range)
        object_codes = organization.account_objects.where(code: account_range).order(code: :asc).pluck(:code)

        report[category_type][range] =
          {title: title, accounts: fields_for_account_objects(object_codes: object_codes, fund_code: fund_codes)}
        report[category_type][range][:balances] = aggregate_total report[category_type][range][:accounts]
      end

      report[:"#{category_type}_range_totals"] = aggregate_range_total(report[category_type])
    end

    calculate_excess_revenues(report)
    calculate_net_position(report)

    report
  end

  def fields_for_account_objects(object_codes:, fund_code:)
    restricted_select_str = @restricted_codes.any? ? @restricted_codes.map {|code| "'#{code}'" }.join(",") : "'-1'"
    unrestricted_select_str = if @unrestricted_codes.any?
                                @unrestricted_codes.map {|code|
                                  "'#{code}'"
                                }.join(",")
                              else
                                "'-1'"
                              end

    row = @totals.where(fund_code: fund_code, object_code: object_codes, resource_code: @resource_codes).group(
      :object_code, :description
    ).select("object_code AS code").select(:description).select("CAST(SUM(total_in_cents) AS BIGINT) AS \"balance\"").select("CAST(SUM(CASE WHEN \"resource_code\" IN (#{unrestricted_select_str}) THEN total_in_cents ELSE 0 END) AS BIGINT)\"unrestricted\"").select("CAST(SUM(CASE WHEN \"resource_code\" IN (#{restricted_select_str}) THEN total_in_cents ELSE 0 END) AS BIGINT) \"restricted\"")

    @resource_codes.each do |code|
      row = row.select("CAST(SUM(CASE WHEN \"resource_code\" = '#{code}' THEN total_in_cents ELSE 0 END) AS BIGINT) AS \"#{code}\"")
    end

    # Transform into a hash and format money values
    row.order(:object_code).to_a.map(&:serializable_hash).map do |item|
      item.transform_values! {|v| v.is_a?(String) ? v : Money.new(v).format }
    end
  end

  def calculate_excess_revenues(report)
    revenues = report[:revenues_range_totals]
    expenses = report[:expenses_range_totals]

    report[:excess_revenues_totals] = revenues.keys.each_with_object({}) do |code, ret|
      next(ret) if %i[code description].include? code.to_sym

      revenue_value = parse_amount(revenues[code])
      expense_value = parse_amount(expenses[code])

      ret[code] = (revenue_value - expense_value).format
    end
  end

  def calculate_net_position(report)
    excess_revenues = report[:excess_revenues_totals]
    other_financing = report[:other_financing_range_totals]

    report[:net_position_totals] = excess_revenues.keys.each_with_object({}) do |code, ret|
      next(ret) if %i[code description].include? code.to_sym

      excess_revenue_value = parse_amount(excess_revenues[code])
      other_financing_value = parse_amount(other_financing[code])

      ret[code] = (excess_revenue_value + other_financing_value).format
    end
  end
end
