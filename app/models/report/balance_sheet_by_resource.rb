# == Schema Information
#
# Table name: report_balance_sheet_by_resources
#
#  id              :bigint(8)        not null, primary key
#  start_date      :date             default(Sat, 26 Oct 2019)
#  end_date        :date             default(Sun, 25 Oct 2020)
#  data            :json
#  organization_id :bigint(8)
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#
# Indexes
#
#  index_report_balance_sheet_by_resources_on_organization_id  (organization_id)
#
# Foreign Keys
#
#  fk_rails_...  (organization_id => organizations.id)
#
class Report::BalanceSheetByResource < ApplicationRecord
  include Reports::Reportable
  include Reports::ResourceReportable
  include Reports::CashFlowReportable

  # CALLBACKS
  #-----------------------------------------------------------------------------
  after_create :run_report

  # RELATIONSHIPS
  #-----------------------------------------------------------------------------
  belongs_to :organization
  delegate :name, :id, to: :organization, prefix: true
  store_accessor  :data, :account_search_params, :account_funds, :assets, :total_assets,
                  :liabilities, :total_liabilities, :net_fund_balance,
                  :equities, :equity_balance, :net_income_loss

  ##
  # performs run_sheet for each account_fund
  #
  def run_report(_should_save=true)
    self.data ||= {}
    self.account_search_params = account_search_params&.symbolize_keys

    data[:fund_code] = account_search_params[:fund_code].join(', ')

    account_search_params && account_search_params.transform_values! {|v|
                               parse_list_range_field(v)
                             }.filter! {|_k, v| !v.empty? }

    setup do
      # Set account fund id
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

      @default_row = [*unrestricted_resources.map {|res|
                        [res.code, "$0.00"]
                      }, ["unrestricted", "$0.00"], *restricted_resources.map {|res|
                                                      [res.code, "$0.00"]
                                                    }, ["restricted", "$0.00"], ["balance", "$0.00"]].to_h.freeze
    end

    # Calculate Net Income and Loss
    # ----------------------------------------------------------------------------------------------------
    p_and_l = Report::ProfitAndLossByResourceReport.where(
      organization: organization
    ).where("data->>'fund_code' = ?", account_search_params[:fund_code].join(', ')).order(:id).first

    if p_and_l.nil?
      p_and_l = Report::ProfitAndLossByResourceReport.new
    end
    # only save if save is set to true
    p_and_l.assign_attributes(
      organization: organization,
      start_date: "#{FiscalYear.get_year(end_date)}-07-01",
      end_date: end_date,
      account_search_params: account_search_params
    )

    unless p_and_l.new_record?
      p_and_l.run_report(true)
    end
    p_and_l.save  
    
    @net_income_and_loss = p_and_l.data.dig("reports", "all", "net_position_totals")
    # ----------------------------------------------------------------------------------------------------

    data[:titles] = [*@unrestricted_codes, :unrestricted, *@restricted_codes, :restricted]
    data[:unrestricted_codes] = @unrestricted_codes
    data[:restricted_codes] = @restricted_codes

    # Run Reports
    data[:reports][:all] = run_sheet(data[:account_funds])
    if data[:account_funds].length > 1
      data[:account_funds].each do |fund|
        data[:reports][fund.code.to_sym] = run_sheet([fund])
      end
    end

    # Cleanup
    drop_views

    save if _should_save

    self
  end

  # SETUP METHODS
  #------------------------------------------------------------------------------------------------------
  def drop_views
    ActiveRecord::Base.connection.execute "
      DROP MATERIALIZED VIEW IF EXISTS #{view_table_name(:totals_view)} CASCADE;
      DROP MATERIALIZED VIEW IF EXISTS #{view_table_name(:entry_items_view)} CASCADE;
      DROP VIEW IF EXISTS #{view_table_name(:accounts_view)} CASCADE;
    "
  end

  def setup_accounts_view
    # NOTE: Need this to limit entry items to selected accounts
    table_query = Account::AccountSearch.new(
      scope: organization.accounts.joins(:account_fund, :account_resource, :account_object),
      filters: data[:account_elements]
    ).results.select("accounts.*, account_objects.code as object_code, account_objects.object_type as account_object_type, account_funds.code as fund_code, account_resources.code as resource_code").to_sql
    query = "CREATE OR REPLACE VIEW #{view_table_name(:accounts_view)} AS " + table_query
    ActiveRecord::Base.connection.execute query
  end

  def setup_entry_items_view
    table_query = Entry::EntryItemSearch.new(
      scope: EntryItem.joins(:entry, :account, account: [:account_fund, :account_resource, :account_object]),
      filters: {
        organization_id: organization_id,
        end_date: end_date,
        approved: true,
        account: account_search_params
      }
    ).results.select("\"entry_items\".amount_in_cents, \"entry_items\".account_id, \"entry_items\".type, \"entries\".date as date, account_objects.code as object_code, account_funds.code as fund_code").to_sql
    query = "CREATE MATERIALIZED VIEW #{view_table_name(:entry_items_view)} AS " + table_query + "
    ;
    "

    ActiveRecord::Base.connection.execute query
  end

  def setup_totals_view
    query = "
    CREATE MATERIALIZED VIEW #{view_table_name(:totals_view)} AS
    SELECT 	account_objects.name AS description,
		        accounts.fund_code,
            accounts.object_code,
	          accounts.resource_code,
      SUM(CASE
        WHEN account_objects.normal_balance = 'Debit'  AND \"type\" = 'Debit'  THEN  amount_in_cents
        WHEN account_objects.normal_balance = 'Credit' AND \"type\" = 'Credit' THEN  amount_in_cents
        WHEN account_objects.normal_balance = 'Debit'  AND \"type\" = 'Credit' THEN -amount_in_cents
        WHEN account_objects.normal_balance = 'Credit' AND \"type\" = 'Debit'  THEN -amount_in_cents
      END) as \"total_in_cents\"
    FROM #{view_table_name(:entry_items_view)} AS entry_items
      INNER JOIN #{view_table_name(:accounts_view)} AS accounts ON accounts.id = entry_items.account_id
      INNER JOIN account_objects ON account_objects.id = accounts.account_object_id
    GROUP BY resource_code, accounts.object_code, accounts.fund_code, account_objects.name;

    CREATE INDEX #{view_table_name(:totals_view_resource_code)} ON #{view_table_name(:totals_view)} (resource_code);
    CREATE INDEX #{view_table_name(:totals_view_fund_code)} ON #{view_table_name(:totals_view)} (fund_code);
    "

    ActiveRecord::Base.connection.execute query
  end

  def setup_local_classes
    # Totals
    @totals = Class.new(ApplicationRecord) do
      self.table_name = "account_objects"
    end

    @totals.table_name = view_table_name(:totals_view)
  end

  # QUERY METHODS
  #------------------------------------------------------------------------------------------------------
  def run_sheet(funds)
    report = {}
    fund_codes = funds.map(&:code)

    # CODES
    @asset_codes     ||= organization.account_objects.where(object_type: "BS - Asset").order(code: :asc).pluck(:code)
    @liability_codes ||= organization.account_objects.where(object_type: "BS - Liability").order(code: :asc).pluck(:code)
    @equity_codes    ||= organization.account_objects.where(object_type: "Equity").where.not(code: "9791").order(code: :asc).pluck(:code)

    # SECTIONS
    report[:assets]      = fields_for_account_objects(object_codes: @asset_codes,     fund_code: fund_codes)
    report[:liabilities] = fields_for_account_objects(object_codes: @liability_codes, fund_code: fund_codes)
    report[:equities]    = fields_for_account_objects(object_codes: @equity_codes,    fund_code: fund_codes)

    # TOTALS
    report[:total_assets]      = aggregate_total report[:assets]
    report[:total_liabilities] = aggregate_total report[:liabilities]
    report[:total_equities]    = aggregate_total report[:equities]
    report[:net_income_loss]   = @net_income_and_loss

    beginning_balance = report[:total_assets].keys.each_with_object({}) do |code, ret| 
      # next(ret) if ["code", "description"].include? code.to_s
      
      total = parse_amount(report[:total_assets][code]) - parse_amount(report[:total_liabilities][code]) - parse_amount(report[:total_equities][code]) - parse_amount(report[:net_income_loss][code])

      ret[code] = total.format
    end
    beginning_balance['code'] = '9791'
    beginning_balance['description'] = 'Beginning Balance'

    report[:equities].insert(0, beginning_balance)

    # # 97** TOTALS
    # report[:total_9700s] =
    #   fields_for_account_objects(object_codes: 9792..9799, fund_code: fund_codes).first || @default_row

    # # NET INCOME LOSS
    # # net_income_loss = (total_assets - total_liabilities - total_nine_thousands)
    # report[:net_income_loss] = report[:total_9700s].keys.each_with_object({}) do |code, ret|
    #   next(ret) if ["code", "description"].include? code.to_s

    #   total = parse_amount(report[:total_assets][code]) - parse_amount(report[:total_liabilities][code]) - parse_amount(report[:total_9700s][code])
    #   ret[code] = total.format
    # end

    # EQUITY BALANCE = (beginning_balance + equities_pre_total + net_income_loss)
    report[:equity_balance] = report[:total_equities].keys.each_with_object({}) do |code, ret|
      next(ret) if ["code", "description"].include? code.to_s

      total = parse_amount(beginning_balance[code]) + parse_amount(report[:total_equities][code]) + parse_amount(report[:net_income_loss][code])
      ret[code] = total.format
    end

    # NET YTD FUND BALANCE = (equity_balance + total_liabilities)
    report[:net_fund_balance] = report[:total_equities].keys.each_with_object({}) do |code, ret|
      next(ret) if ["code", "description"].include? code.to_s

      total = parse_amount(report[:equity_balance][code]) + parse_amount(report[:total_liabilities][code])
      ret[code] = total.format
    end

    report
  end

  def aggregate_total(section)
    return @default_row if section.empty?

    section.first.keys.each_with_object({}) do |code, ret|
      next(ret) if [:code, :description].include? code.to_sym

      ret[code] = section.inject(Money.new(0)) {|total, obj| total + parse_amount(obj[code]) }.format
    end
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

    row = @totals.where(fund_code: fund_code, object_code: object_codes, resource_code: @resource_codes)
                 .group(:object_code, :description)
                 .select("object_code AS code")
                 .select(:description)
                 .select("CAST(SUM(total_in_cents) AS BIGINT) AS \"balance\"")
                 .select("CAST(SUM(CASE WHEN \"resource_code\" IN (#{unrestricted_select_str}) THEN total_in_cents ELSE 0 END) AS BIGINT)\"unrestricted\"")
                 .select("CAST(SUM(CASE WHEN \"resource_code\" IN (#{restricted_select_str}) THEN total_in_cents ELSE 0 END) AS BIGINT) \"restricted\"")

    @resource_codes.each do |code|
      row = row.select("CAST(SUM(CASE WHEN \"resource_code\" = '#{code}' THEN total_in_cents ELSE 0 END) AS BIGINT) AS \"#{code}\"")
    end

    # Transform into a hash and format money values
    row.order(:object_code).to_a.map(&:serializable_hash).map do |item|
      item.transform_values! {|v| v.is_a?(String) ? v : Money.new(v).format }
    end
  end

  def start_date
    Date.parse "2018-07-01"
  end

  def colspan_width
    (get_account_funds&.length || 0) + 4
  end
end
