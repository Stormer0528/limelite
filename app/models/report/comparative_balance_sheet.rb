# == Schema Information
#
# Table name: report_comparative_balance_sheets
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
#  index_comparative_balance_sheets_on_organization_id  (organization_id)
#
# Foreign Keys
#
#  fk_rails_...  (organization_id => organizations.id)
#

class Report::ComparativeBalanceSheet < ApplicationRecord
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

    current = "#{FiscalYear.get_year(end_date)}-07-01"
    before = "#{FiscalYear.get_year(1.year.before(end_date))}-07-01"

    p_and_l_current = Report::ProfitAndLossStatement.where(
      organization: organization, start_date: current
    ).where("data->>'fund_code' = ?", account_search_params[:fund_code].join(', ')).first

    p_and_l_before = Report::ProfitAndLossStatement.where(
      organization: organization, start_date: before
    ).where("data->>'fund_code' = ?", account_search_params[:fund_code].join(', ')).first

    if p_and_l_current.nil?
      p_and_l_current = Report::ProfitAndLossStatement.new
    end

    if p_and_l_before.nil?
      p_and_l_before = Report::ProfitAndLossStatement.new
    end

    p_and_l_current.assign_attributes(organization: organization, start_date: current, end_date: end_date, account_search_params: account_search_params.clone)
    p_and_l_before.assign_attributes(organization: organization, start_date: before, end_date: 1.year.before(end_date), account_search_params: account_search_params.clone)

    unless p_and_l_current.new_record?
      p_and_l_current.run_report(true)
    else
      p_and_l_current.save
    end

    unless p_and_l_before.new_record?
      p_and_l_before.run_report(true)
    else
      p_and_l_before.save
    end

    self.data ||= {}
    # Set account fund id
    account_search_params&.transform_values! {|v| parse_list_range_field(v) }

    data[:account_search_params] = account_search_params.clone
    data[:account_funds] = get_account_funds
    data[:fund_code] = account_fund_code
    data[:fund_name] = account_fund_name

    # ASSETS
    temp_assets = []

    organization.account_objects.where(object_type: "BS - Asset").order(code: :asc).each do |acc_obj|
      current_balances = []
      before_balances = []

      data[:account_funds].each do |fund|
        current_bal = acc_obj.bs_balance(start_date, end_date, account_search_params&.merge(fund_code: fund.code))
        current_balances << current_bal

        before_bal = acc_obj.bs_balance(1.year.before(start_date), 1.year.before(end_date), account_search_params&.merge(fund_code: fund.code))
        before_balances << before_bal
      end

      temp_assets.push(
        code: acc_obj.code,
        name: acc_obj.name,
        current_balance: current_balances.inject(Money.new(0)) {|total, balance| total + balance },
        before_balance: before_balances.inject(Money.new(0)) {|total, balance| total + balance}
      )
    end

    data[:assets] = temp_assets.map {|asset| asset.merge(current_balance: asset[:current_balance]&.format, before_balance: asset[:before_balance]&.format)}

    # Assets Totals
    current_total_assets = temp_assets.inject(Money.new(0)) {|total, asset| total + asset[:current_balance] }
    before_total_assets = temp_assets.inject(Money.new(0)) {|total, asset| total + asset[:before_balance] }

    data[:total_assets] = {
      current_balance: current_total_assets&.format,
      before_balance: before_total_assets&.format
    }

    # LIABILITIES
    temp_liabilities = []

    organization.account_objects.where(object_type: "BS - Liability").order(code: :asc).each do |acc_obj|
      current_balances = []
      before_balances = []

      data[:account_funds].each do |fund|
        current_bal = acc_obj.bs_balance(start_date, end_date, account_search_params&.merge(fund_code: fund.code))
        current_balances << current_bal

        before_bal = acc_obj.bs_balance(1.year.before(start_date), 1.year.before(end_date), account_search_params&.merge(fund_code: fund.code))
        before_balances << before_bal
      end

      temp_liabilities.push(
        code: acc_obj.code,
        name: acc_obj.name,
        current_balance: current_balances.inject(Money.new(0)) {|total, balance| total + balance },
        before_balance: before_balances.inject(Money.new(0)) {|total, balance| total + balance }
      )
    end

    data[:liabilities] = temp_liabilities.map {|l| l.merge(current_balance: l[:current_balance]&.format, before_balance: l[:before_balance]&.format) }


    # Liabilities Totals
    current_total_liabilities = temp_liabilities.inject(Money.new(0)) {|total, l| total + l[:current_balance] }
    before_total_liabilities = temp_liabilities.inject(Money.new(0)) {|total, l| total + l[:before_balance]}

    data[:total_liabilities] = {
      current_balance: current_total_liabilities&.format,
      before_balance: before_total_liabilities&.format
    }

    # NET INCOME LOSS
    before_net_income_loss = Monetize.parse(p_and_l_before.data.dig("net_position_totals", "balance"))
    current_net_income_loss = Monetize.parse(p_and_l_current.data.dig("net_position_totals", "balance"))

    data[:net_income_loss] = {
      current_balance: current_net_income_loss&.format,
      before_balance: before_net_income_loss&.format
    }

    # ALL OF THE OBJECTS 9792..9799
    nine_thousands_before = []
    nine_thousands_current = []

    organization.account_objects.where(code: 9792..9799).map do |acc_obj|
      data[:account_funds].each do |fund|
        current_bal = acc_obj.bs_balance(start_date, end_date, account_search_params&.merge(fund_code: fund.code))
        nine_thousands_current << current_bal

        before_bal = acc_obj.bs_balance(1.year.before(start_date), 1.year.before(end_date), account_search_params&.merge(fund_code: fund.code))
        nine_thousands_before << before_bal
      end
    end

    # 97** Totals
    before_total_nine_thousands = nine_thousands_before.inject(Money.new(0)) {|total, balance| total + balance }
    current_total_nine_thousands = nine_thousands_current.inject(Money.new(0)) {|total, balance| total + balance }
    data[:total_nine_thousands] = {
      current_balance: current_total_nine_thousands&.format,
      before_balance: before_total_nine_thousands&.format
    }

    # EQUITIES
    temp_equities = [
      {
        code: nil,
        name: "Beginning Balance",
        current_balance: current_total_assets - current_total_liabilities - current_net_income_loss - current_total_nine_thousands,
        before_balance: before_total_assets - before_total_liabilities - before_net_income_loss - before_total_nine_thousands
      }
    ]

    equity_objects = organization.account_objects.where(object_type: "Equity").where.not(code: "9791")

    equity_objects.each do |acc_obj|
      current_fund_balances = []
      before_fund_balances = []

      data[:account_funds].each do |fund|
        current_bal = acc_obj.bs_balance(start_date, end_date, account_search_params&.merge(fund_code: fund.code))
        current_fund_balances << current_bal

        before_bal = acc_obj.bs_balance(1.year.before(start_date), 1.year.before(end_date), account_search_params&.merge(fund_code: fund.code))
        before_fund_balances << before_bal
      end

      temp_equities.push(
        code: acc_obj.code,
        name: acc_obj.name,
        current_balance: current_fund_balances.inject(Money.new(0)) {|total, balance| total + balance },
        before_balance: before_fund_balances.inject(Money.new(0)) {|total, balance| total + balance}
      )
    end

    data[:equities] = temp_equities.map {|e| e.merge(current_balance: e[:current_balance]&.format, before_balance: e[:before_balance]&.format) }

    # Equities Totals
    current_equities_pre_total = temp_equities.inject(Money.new(0)) {|total, e| total + e[:current_balance] }
    before_equities_pre_total = temp_equities.inject(Money.new(0)) {|total, e| total + e[:before_balance] }

    # NET YTD FUND BALANCE
    current_equity_balance = (current_equities_pre_total + current_net_income_loss)
    before_equity_balance = (before_equities_pre_total + before_net_income_loss)

    data[:equity_balance] = {
      current_balance: current_equity_balance&.format,
      before_balance: before_equity_balance&.format
    }

    data[:net_fund_balance] = {
      current_balance: (current_equity_balance + current_total_liabilities)&.format,
      before_balance: (before_equity_balance + before_total_liabilities)&.format
    }

    data[:titles] = ["Object", "Description", end_date.strftime('%Y-%m-%d'), 1.year.before(end_date).strftime('%Y-%m-%d'), "$ Change", "% Change"]

    save if should_save
  end

  def titles
    ["Assets", end_date.strftime('%Y-%m-%d'), 1.year.before(end_date).strftime('%Y-%m-%d'), "$ Change", "% Change"]
  end

  def get_account_funds
    filter_val = account_search_params && account_search_params[:fund_code]

    if filter_val.is_a? String
      filter_val = filter_val.split(",")
      filter_val = filter_val.map {|val| val =~ /\.\.\.|-/ ? Range.new(*val.split(/\.\.\.|-/).map(&:to_i)) : val}
    end

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

  def colspan_width
    7
  end

  # All balance sheets parse items from
  def start_date
    Date.parse "2018-07-01"
  end
end
