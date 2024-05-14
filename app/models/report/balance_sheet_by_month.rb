# == Schema Information
#
# Table name: report_balance_sheet_by_months
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
#  index_report_balance_sheet_by_months_on_organization_id  (organization_id)
#
# Foreign Keys
#
#  fk_rails_...  (organization_id => organizations.id)
#
class Report::BalanceSheetByMonth < ApplicationRecord
  include Reports::Reportable
  include Reports::MonthlyReportable
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

  def run_report(should_save = true)
    self.data ||= {}
    self.account_search_params = account_search_params&.symbolize_keys
    # Set account fund id
    account_search_params && account_search_params.transform_values! {|v| parse_list_range_field(v)}

    data[:account_funds] = get_account_funds
    data[:fund_code] = account_fund_code
    data[:fund_name] = account_fund_name

    data[:account_elements] = account_search_params.transform_values {|v| v.map(&:to_s).join(", ") }

    data[:reports] = {}
    data[:reports][:all] = run_sheet(data[:account_funds])

    if data[:account_funds].length > 1
      data[:account_funds].each do |fund|
        data[:reports][fund.code.to_sym] = run_sheet([fund])
      end
    end

    save
    self
  end

  def run_sheet(funds)
    report = {}
    fund_codes = funds.map(&:code)
    account_search_params ||= {}

    # ASSETS
    temp_assets = []
    organization.account_objects.where(object_type: "BS - Asset").order(code: :asc).each do |acc_obj|
      obj_account_funds = {}

      # Always get date from beginning of limelite
      start_date = Date.parse "2018-07-01"
      temp_assets.push(
        code:          acc_obj.code,
        name:          acc_obj.name,
        account_funds: obj_account_funds,
        balance:       acc_obj.bs_balance(start_date, end_date, account_search_params.merge(fund_code: fund_codes)),
        month_totals: months.each_with_index.map do |month, index|
          month_end_date = (index == months.length - 1) ? end_date : month.end_of_month
          acc_obj.bs_balance(start_date, month_end_date, account_search_params.merge(fund_code: fund_codes))&.format
        end
      )
    end

    report[:assets] = temp_assets.map {|asset| asset.merge(balance: asset[:balance]&.format) }

    # Assets Totals
    total_assets_by_month = months.each_with_index.map do |month, index|
      temp_assets.map {|asset| parse_num asset[:month_totals][index]}
        .inject(Money.new(0)) {|balance, amount| Money.from_amount(amount) + balance}
        .format
    end
    report[:total_assets_by_month] = total_assets_by_month

    total_assets = temp_assets.inject(Money.new(0)) {|total, asset| total + asset[:balance] }
    report[:total_assets] = total_assets&.format

    # LIABILITIES
    temp_liabilities = []
    organization.account_objects.where(object_type: "BS - Liability").order(code: :asc).each do |acc_obj|
      obj_account_funds = {}
      start_date = Date.parse "2018-07-01"
      temp_liabilities.push(
        code:          acc_obj.code,
        name:          acc_obj.name,
        account_funds: obj_account_funds,
        balance:       acc_obj.bs_balance(start_date, end_date, account_search_params.merge(fund_code: fund_codes)),
        month_totals: months.each_with_index.map do |month, index|
          month_end_date = (index == months.length - 1) ? end_date : month.end_of_month
          acc_obj.bs_balance(start_date, month_end_date, account_search_params.merge(fund_code: fund_codes))&.format
        end
      )
    end

    report[:liabilities] = temp_liabilities.map {|l| l.merge(balance: l[:balance]&.format) }

    # Liabilities Totals
    total_liabilities_by_month = months.each_with_index.map do |month, index|
      temp_liabilities.map {|asset| parse_num asset[:month_totals][index]}
        .inject(Money.new(0)) {|balance, amount| Money.from_amount(amount) + balance}
        .format
    end
    report[:total_liabilities_by_month] = total_liabilities_by_month


    total_liabilities = temp_liabilities.inject(Money.new(0)) {|total, l| total + l[:balance] }
    report[:total_liabilities] = total_liabilities&.format

    # EQUITIES
    temp_equities = []
    organization.account_objects.where(object_type: "Equity").order(code: :asc).each do |acc_obj|
      start_date = Date.parse "2018-07-01"
      obj_account_funds = {}
      fund_balances = []

      temp_equities.push(
        code:          acc_obj.code,
        name:          acc_obj.name,
        account_funds: obj_account_funds,
        balance:       fund_balances.inject(Money.new(0)) {|total, balance| total + balance },
        month_totals: months.each_with_index.map do |month, index|
          month_end_date = (index == months.length - 1) ? end_date : month.end_of_month
          acc_obj.bs_balance(start_date, month_end_date, account_search_params.merge(fund_code: fund_codes))&.format
        end
      )
    end

    report[:equities] = temp_equities.map {|e| e.merge(balance: e[:balance]&.format) }

    # Equities Totals
    total_equities_by_month = months.each_with_index.map do |month, index|
      temp_equities.map {|asset| parse_num asset[:month_totals][index]}
        .inject(Money.new(0)) {|balance, amount| Money.from_amount(amount) + balance}
    end
    report[:total_equities_by_month] = total_equities_by_month.map(&:format)

    equities_pre_total = temp_equities.inject(Money.new(0)) {|total, e| total + e[:balance] }

    # ALL OF THE OBJECTS IN THE 97** RANGE
    nine_thousands = []
    nine_thousands_account_fund_totals = account_fun_obj

    organization.account_objects.where(code: 9700..9799).map do |acc_obj|
      data[:account_funds].each do |fund|
        bal = acc_obj.bs_balance(start_date, end_date, account_search_params&.merge(fund_code: fund.code))
        nine_thousands << bal
        nine_thousands_account_fund_totals[fund.code.to_sym] << bal
      end
    end

    nine_thousands_account_by_month = months.each_with_index.map do |month, index|
      organization.account_objects.where(code: 9700..9799).map do |acc_obj|
        data[:account_funds].map do |fund|
          month_end_date = (index == months.length - 1) ? end_date : month.end_of_month
          acc_obj.bs_balance(start_date, month_end_date, account_search_params&.merge(fund_code: fund.code))
        end.inject(Money.new(0)) {|total, balance| total + balance }
      end.inject(Money.new(0)) {|total, balance| total + balance }
    end

    # 97** Totals
    total_nine_thousands = nine_thousands.inject(Money.new(0)) {|total, balance| total + balance }
    report[:total_nine_thousands] = total_nine_thousands.format
    report[:nine_thousands_account_by_month] = nine_thousands_account_by_month.map(&:format)

    # NET INCOME LOSS
    net_income_loss = (total_assets - total_liabilities - total_nine_thousands)
    equity_balance = (equities_pre_total + net_income_loss)

    # NET YTD FUND BALANCE
    report[:net_income_loss] = net_income_loss&.format
    report[:equity_balance] = equity_balance&.format
    report[:net_fund_balance] = (equity_balance + total_liabilities)&.format

    net_income_loss_by_month = months.each_with_index.map do |month, index|
      # total_assets  - total_liabilities - total_9000s
      Money.from_amount(parse_num total_assets_by_month[index]) - Money.from_amount(parse_num total_liabilities_by_month[index]) - nine_thousands_account_by_month[index]
    end
    report[:net_income_loss_by_month] = net_income_loss_by_month.map(&:format)

    equity_balance_by_month = months.each_with_index.map do |month, index|
      # total_equities - net_income_loss
      total_equities_by_month[index] + net_income_loss_by_month[index]
    end
    report[:equity_balance_by_month] = equity_balance_by_month.map(&:format)

    net_fund_balance_by_month = months.each_with_index.map do |month, index|
      # equity_balance + total_liablities
      equity_balance_by_month[index] + Money.from_amount(parse_num total_liabilities_by_month[index])
    end
    report[:net_fund_balance_by_month] = net_fund_balance_by_month.map(&:format)

    report
  end

  def get_account_funds
    return {} if !organization

    filter_val = account_search_params && account_search_params[:fund_code]

    if filter_val.is_a? String
      filter_val = filter_val.split(",")
      filter_val = filter_val.map {|val| (val =~ /\.\.\.|-/) ? Range.new(*val.split(/\.\.\.|-/).map(&:to_i)) : val}
    end

    unless filter_val.present?
      organization.account_funds&.order("code::integer ASC") || []
    else
      organization.account_funds.where(code: filter_val).order("code::integer ASC")
    end
  end

  def account_fund_name
    (data&.with_indifferent_access&.dig(:account_funds) || []).map {|fund| fund[:name] }.join(", ")
  end

  def account_fund_code
    (data&.with_indifferent_access&.dig(:account_funds) || []).map {|fund| fund[:code] }.join(", ")
  end

  def account_fund_id
    (data&.with_indifferent_access&.dig(:account_funds) || []).map {|fund| fund[:id] }.join(",")
  end

  def parse_list_range_field(filter_val)
    if filter_val.is_a? String
      filter_val = filter_val.split(",").map(&:strip)
      filter_val = filter_val.map {|val| (val =~ /\.\.\.|-/) ? Range.new(*val.split(/\.\.\.|-/).map(&:to_i)) : val}
    end

    filter_val
  end

  def account_fun_obj
    data[:account_funds].inject(Hash.new) {|obj, fund| obj[fund.code.to_sym] = []; obj }
  end

  def colspan_width
    (get_account_funds&.length || 0) + 4
  end
end
