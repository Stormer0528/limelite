# == Schema Information
#
# Table name: report_comparative_profit_and_loss_statements
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
#  index_comparative_profit_loss_statements_on_organization_id  (organization_id)
#
# Foreign Keys
#
#  fk_rails_...  (organization_id => organizations.id)
#

class Report::ComparativeProfitAndLossStatement < ApplicationRecord
  include Reports::Reportable
  include Reports::MaterializedAccountFundReportable
  include Reports::ProfitAndLossReportable
  include Reports::ComparativeReportable

  # CALLBACKS
  #-----------------------------------------------------------------------------
  after_create :run_report

  # RELATIONSHIPS
  #-----------------------------------------------------------------------------
  belongs_to :organization
  delegate :name, :id, to: :organization, prefix: true, allow_nil: true
  store_accessor  :data, :account_search_params, :account_funds,
                  :excess_revenues, :revenues_total, :expenses_total

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

  Types = {
    "8900-8929": "Revenue",
    "7600-7629": "Expense",
    "8930-8979": "Revenue",
    "7630-7699": "Expense",
    "8980-8999": "Revenue"
  }.freeze

  def run_report(_should_save=true)
    self.data ||= {}

    self.account_search_params = account_search_params&.symbolize_keys
    normalize_data!

    setup do
      data[:fiscal_year] = FiscalYear.get_year(end_date).year
      data[:report_date] = Date.today.to_formatted_s(:std)

      # Set up Table Views and Accessor Classes
      setup_accounts_view
      setup_entry_items_view
      setup_totals_view
      setup_local_classes

      @fund_codes = data[:account_funds].pluck(:code)
      @default_row = [["before_balance", "$0.00"], ["current_balance", "$0.00"]].to_h.freeze
    end

    Report::ProfitAndLossStatement::Categories.each do |category_type, obj|
      data[category_type] = {}

      obj.each do |range, title|
        account_range = parse_account_range(range)
        object_codes = organization.account_objects.where(code: account_range).order(code: :asc).pluck(:code)

        data[category_type][range] = {title: title, accounts: fields_for_account_objects(object_codes: object_codes)}
        data[category_type][range][:balances] = aggregate_total data[category_type][range][:accounts]
      end

      data[:"#{category_type}_range_totals"] = aggregate_range_total(data[category_type], Types)
    end

    calculate_excess_revenues!
    calculate_net_position!

    drop_views

    save
  end

  def subtitle
    "Profit and Loss Statement by Fund"
  end

  ##
  # Create an object each account fund as a key and an array for account objects
  def account_fun_obj
    data[:account_funds].each_with_object({}) {|fund, obj| obj[fund.code.to_sym] = []; }
  end

  def colspan_width
    7
  end

  def titles
    ["Object", "Description", end_date.strftime('%Y-%m-%d'), 1.year.before(end_date).strftime('%Y-%m-%d'), "$ Change", "% Change"]
  end

  def fields_for_account_objects(object_codes:)
    row = @totals.where(fund_code: @fund_codes, object_code: object_codes)
                 .group(:object_code, :description)
                 .select("object_code AS code")
                 .select(:description)
                 .select('CAST(SUM(CASE WHEN "year_before" = 1 THEN total_in_cents ELSE 0 END) AS BIGINT) AS "before_balance"')
                 .select('CAST(SUM(CASE WHEN "year_before" = 0 THEN total_in_cents ELSE 0 END) AS BIGINT) AS "current_balance"')

    # Transform into a hash and format money values
    row.order(:object_code).to_a.map(&:serializable_hash).map do |item|
      item.transform_values! {|v| v.is_a?(String) ? v : Money.new(v).format }
    end
  end
end
