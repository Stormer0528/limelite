# == Schema Information
#
# Table name: report_balance_sheets
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
#  index_report_balance_sheets_on_organization_id  (organization_id)
#
# Foreign Keys
#
#  fk_rails_...  (organization_id => organizations.id)
#

class Report::BalanceSheet < ApplicationRecord
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

  def run_report(should_save=true)
    self.account_search_params = account_search_params&.symbolize_keys

    p_and_l = Report::ProfitAndLossStatement.where(
      organization: organization
    ).where("data->>'fund_code' = ?", account_search_params[:fund_code].join(', ')).order(:id).first

    if p_and_l.nil?
      p_and_l = Report::ProfitAndLossStatement.new
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

    self.data ||= {}
    # Set account fund id
    account_search_params&.transform_values! {|v| parse_list_range_field(v) }
    data[:account_funds] = get_account_funds
    data[:fund_code] = account_fund_code
    data[:fund_name] = account_fund_name

    # ASSETS
    temp_assets = []
    assets_account_fund_totals = account_fun_obj

    organization.account_objects.where(object_type: "BS - Asset").order(code: :asc).each do |acc_obj|
      obj_account_funds = {}
      fund_balances = []

      data[:account_funds].each do |fund|
        bal = acc_obj.bs_balance(start_date, end_date, account_search_params&.merge(fund_code: fund.code))
        obj_account_funds[fund.code.to_sym] = bal.format
        fund_balances << bal
        assets_account_fund_totals[fund.code.to_sym] << bal
      end

      temp_assets.push(
        code: acc_obj.code,
        name: acc_obj.name,
        account_funds: obj_account_funds,
        balance: fund_balances.inject(Money.new(0)) {|total, balance| total + balance }
      )
    end

    data[:assets] = temp_assets.map {|asset| asset.merge(balance: asset[:balance]&.format) }

    # Assets Totals
    total_assets_by_account_funds = {}
    data[:account_funds].each do |fund|
      total_assets_by_account_funds[fund.code.to_sym] = assets_account_fund_totals[fund.code.to_sym].inject(Money.new(0)) {|total, balance| total + balance }
    end
    data[:total_assets_by_account_funds] = total_assets_by_account_funds.transform_values(&:format)

    total_assets = temp_assets.inject(Money.new(0)) {|total, asset| total + asset[:balance] }
    data[:total_assets] = total_assets&.format

    # LIABILITIES
    temp_liabilities = []
    liabilities_account_fund_totals = account_fun_obj

    organization.account_objects.where(object_type: "BS - Liability").order(code: :asc).each do |acc_obj|
      obj_account_funds = {}
      fund_balances = []

      data[:account_funds].each do |fund|
        bal = acc_obj.bs_balance(start_date, end_date, account_search_params&.merge(fund_code: fund.code))
        obj_account_funds[fund.code.to_sym] = bal.format
        fund_balances << bal
        liabilities_account_fund_totals[fund.code.to_sym] << bal
      end

      temp_liabilities.push(
        code: acc_obj.code,
        name: acc_obj.name,
        account_funds: obj_account_funds,
        balance: acc_obj.bs_balance(start_date, end_date, account_search_params))
    end

    data[:liabilities] = temp_liabilities.map {|l| l.merge(balance: l[:balance]&.format) }


    # Liabilities Totals
    total_liabilities_by_account_funds = {}
    data[:account_funds].each do |fund|
      total_liabilities_by_account_funds[fund.code.to_sym] = liabilities_account_fund_totals[fund.code.to_sym].inject(Money.new(0)) {|total, balance| total + balance }
    end
    data[:total_liabilities_by_account_funds] = total_liabilities_by_account_funds.transform_values(&:format)

    total_liabilities = temp_liabilities.inject(Money.new(0)) {|total, l| total + l[:balance] }
    data[:total_liabilities] = total_liabilities&.format


    # NET INCOME LOSS
    net_income_loss = Monetize.parse(p_and_l.data.dig("net_position_totals", "balance"))

    data[:net_income_loss] = net_income_loss&.format

    net_income_loss_by_account_funds = {}

    data[:account_funds].each do |fund|
      net_income_loss_by_account_funds[fund.code.to_sym] =
        Monetize.parse(p_and_l.data.dig("net_position_totals", fund.code))
    end

    data[:net_income_loss_by_account_funds] = net_income_loss_by_account_funds.transform_values(&:format)

    # ALL OF THE OBJECTS 9700..9799, excluding 9791 as it is for beginning balance
    nine_thousands = []
    nine_thousands_account_fund_totals = account_fun_obj

    organization.account_objects.where(code: 9700..9799).where.not(code: 9791).map do |acc_obj|
      data[:account_funds].each do |fund|
        bal = acc_obj.bs_balance(start_date, end_date, account_search_params&.merge(fund_code: fund.code))
        nine_thousands << bal
        nine_thousands_account_fund_totals[fund.code.to_sym] << bal
      end
    end

    # 97** Totals
    total_nine_thousands_by_account_funds = {}
    data[:account_funds].each do |fund|
      total_nine_thousands_by_account_funds[fund.code.to_sym] = nine_thousands_account_fund_totals[fund.code.to_sym].inject(Money.new(0)) {|total, balance| total + balance }
    end

    total_nine_thousands = nine_thousands.inject(Money.new(0)) {|total, balance| total + balance }
    data[:total_nine_thousands] = total_nine_thousands.format
    data[:total_nine_thousands_by_account_funds] = total_nine_thousands_by_account_funds.transform_values(&:format)

    total_beginning_balance = total_assets - total_liabilities - net_income_loss - total_nine_thousands
    total_beginning_balance_by_account_funds = {}
    data[:account_funds].each do |fund|
      total_beginning_balance_by_account_funds[fund.code.to_sym] =
        total_assets_by_account_funds[fund.code.to_sym] -
        total_liabilities_by_account_funds[fund.code.to_sym] -
        net_income_loss_by_account_funds[fund.code.to_sym] -
        total_nine_thousands_by_account_funds[fund.code.to_sym]
    end

    # EQUITIES
    temp_equities = [
      {
        code: nil,
        name: "Beginning Balance",
        account_funds: total_beginning_balance_by_account_funds.transform_values(&:format),
        balance: total_beginning_balance

      }
    ]

    equities_account_fund_totals = total_beginning_balance_by_account_funds.transform_values {|v| [v] }

    equity_objects = organization.account_objects.where(object_type: "Equity").where.not(code: "9791")

    equity_objects.each do |acc_obj|
      obj_account_funds = {}
      fund_balances = []

      data[:account_funds].each do |fund|
        bal = acc_obj.bs_balance(start_date, end_date, account_search_params&.merge(fund_code: fund.code))
        obj_account_funds[fund.code.to_sym] = bal.format
        fund_balances << bal
        equities_account_fund_totals[fund.code.to_sym] << bal
      end

      temp_equities.push(
        code: acc_obj.code,
        name: acc_obj.name,
        account_funds: obj_account_funds,
        balance: fund_balances.inject(Money.new(0)) {|total, balance| total + balance }
      )
    end

    data[:equities] = temp_equities.map {|e| e.merge(balance: e[:balance]&.format) }

    # Equities Totals
    equities_by_account_funds = {}
    data[:account_funds].each do |fund|
      equities_by_account_funds[fund.code.to_sym] = equities_account_fund_totals[fund.code.to_sym].inject(Money.new(0)) {|total, balance| total + balance }
    end

    equities_pre_total = temp_equities.inject(Money.new(0)) {|total, e| total + e[:balance] }


    # NET YTD FUND BALANCE
    equity_balance = (equities_pre_total + net_income_loss)

    data[:equity_balance] = equity_balance&.format
    data[:net_fund_balance] = (equity_balance + total_liabilities)&.format

    equity_balance_by_account_funds = {}
    net_fund_balance_by_account_funds = {}

    data[:account_funds].each do |fund|
      equity_balance_by_account_funds[fund.code.to_sym] = (
        equities_by_account_funds[fund.code.to_sym] +
        net_income_loss_by_account_funds[fund.code.to_sym]
      )

      net_fund_balance_by_account_funds[fund.code.to_sym] = (
        equity_balance_by_account_funds[fund.code.to_sym] +
        total_liabilities_by_account_funds[fund.code.to_sym]
      )
    end

    data[:equity_balance_by_account_funds] = equity_balance_by_account_funds.transform_values(&:format)
    data[:net_fund_balance_by_account_funds] = net_fund_balance_by_account_funds.transform_values(&:format)

    save if should_save
  end

  def get_account_funds
    filter_val = account_search_params && account_search_params[:fund_code]

    unless filter_val.present?
      organization.account_funds.order("code::integer ASC")
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
      filter_val = filter_val.map {|val| val =~ /\.\.\.|-/ ? Range.new(*val.split(/\.\.\.|-/).map(&:to_i)) : val }
    end

    filter_val
  end

  def account_fun_obj
    data[:account_funds].inject({}) {|obj, fund| obj[fund.code.to_sym] = []; obj }
  end

  def colspan_width
    (get_account_funds&.length || 0) + 4
  end

  # All balance sheets parse items from
  def start_date
    Date.parse "2018-07-01"
  end
end
