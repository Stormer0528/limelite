# == Schema Information
#
# Table name: report_cash_flow_reports
#
#  id                  :bigint(8)        not null, primary key
#  start_date          :date
#  end_date            :date
#  display_columns_by  :string           default("Total")
#  show_active_columns :boolean          default(TRUE)
#  show_active_rows    :boolean          default(TRUE)
#  data                :jsonb
#  organization_id     :bigint(8)
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#
# Indexes
#
#  index_report_cash_flow_reports_on_organization_id  (organization_id)
#

class Report::CashFlowReport < ApplicationRecord
  include Reports::CashFlowReportable

  store_accessor  :data, :cash_at_beginning, :cash_at_end,
                  :financing_activities_total, :fiscal_year,
                  :investing_activities_total, :net_cash, :net_cash_increase,
                  :net_income, :account_funds,
                  :net_operations_cash, :other_income_total, :report_date,
                  :account_search_params

  # CALLBACKS
  #-----------------------------------------------------------------------------
  after_create :run_report

  # RELATIONSHIPS
  #-----------------------------------------------------------------------------
  belongs_to :organization

  # Validations
  #-----------------------------------------------------------------------------
  validates :start_date, presence: true
  validates :end_date, presence: true

  def run_report(should_save=true)
    return unless valid?

    account_search_params && account_search_params.transform_values! {|v| parse_list_range_field(v)}

    @account_search_params = account_search_params.merge(:fund_code => get_account_funds.map {|fund| fund[:code]})

    # reset data
    self.data = {"account_search_params" => @account_search_params}

    data["fiscal_year"] = (end_date.month >= 7) ? end_date.year : end_date.year + 1
    data["report_date"] = Date.today.to_formatted_s(:std)

    data["account_funds"] = get_account_funds
    data["fund_code"] = account_fund_code

    reports = account_funds.map {|fund| {fund: fund, name: fund[:code]}}
    reports << {fund: {code: "total", name: "All Funds"}, name: "All Funds"}

    reports.map do |report|
      current_code = report[:name] == "All Funds" ? @account_search_params[:fund_code] : report[:fund][:code]
      search_params = @account_search_params.merge({:fund_code => current_code})

      report["investing_activities"] = []
      report["financing_activities"] = []
      report["other_income"]         = []

      report["cash_at_beginning"]          = "$0.00"
      report["cash_at_end"]                = "$0.00"
      report["financing_activities_total"] = "$0.00"
      report["investing_activities_total"] = "$0.00"
      report["net_cash_increase"]          = "$0.00"
      report["net_cash"]                   = "$0.00"
      report["net_income"]                 = "$0.00"
      report["net_operations_cash"]        = "$0.00"
      report["other_income_total"]         = "$0.00"


      investing_activities.each do |acc_obj|
        obj = {name: acc_obj.name, code: acc_obj.code, balance: acc_obj.balance(start_date, end_date, search_params).format}
        report["investing_activities"] << obj # unless obj[:balance] == "$0.00"
      end

      report["investing_activities_total"] = investing_activities.map{|acc_obj| acc_obj.balance(start_date, end_date, search_params)}.inject(Money.new(0)){|sum, balance| sum + balance}.format

      financing_activities.each do |acc_obj|
        obj = {name: acc_obj.name, code: acc_obj.code, balance: acc_obj.balance(start_date, end_date, search_params).format}
        report["financing_activities"] << obj # unless obj[:balance] == "$0.00"
      end

      report["financing_activities_total"] = financing_activities.map{|acc_obj| acc_obj.balance(start_date, end_date, search_params)}.inject(Money.new(0)){|sum, balance| sum + balance}.format

      other_income.each do |acc_obj|
        obj = {name: acc_obj.name, code: acc_obj.code, balance: acc_obj.balance(start_date, end_date, search_params).format}
        report["other_income"] << obj # unless obj[:balance] == "$0.00"
      end

      report["other_income_total"] = other_income.map{|acc_obj| acc_obj.balance(start_date, end_date, search_params)}.inject(Money.new(0)){|sum, balance| sum + balance}.format

      beginning_cash = cash_accounts_total(beginning_of_fiscal_year, start_date)
      ending_cash = cash_accounts_total(beginning_of_fiscal_year, end_date)
      report["cash_at_beginning"] = beginning_cash.format
      report["cash_at_end"] = ending_cash.format
      report["net_cash"] = (ending_cash - beginning_cash).format

      income_cash = str_to_money report["other_income_total"]
      net_cash =    str_to_money report["net_cash"]
      report["net_operations_cash"] = (net_cash - income_cash).format

      report["net_cash_increase"] = (str_to_money(report["other_income_total"]) + str_to_money(report["financing_activities_total"]) + str_to_money(report["investing_activities_total"])).format
    end
    data[:reports] = reports
    save if should_save
  end

  def get_account_funds
    filter_val = account_search_params && account_search_params[:fund_code]

    if filter_val.is_a? String
      filter_val = filter_val.split(",")
      filter_val = filter_val.map {|val| (val =~ /\.\.\.|-/) ? Range.new(*val.split(/\.\.\.|-/).map(&:to_i)) : val}
    end

    unless filter_val.present?
      organization.account_funds
    else
      organization.account_funds.where(code: filter_val)
    end
  end

  def account_fund_code
    (data&.with_indifferent_access&.dig("account_funds") || []).map {|fund| fund[:code] }.join(", ")
  end

  def account_search_params
    data&.with_indifferent_access.dig(:account_search_params) || {}
  end

  def str_to_money(str)
    Money.from_amount(str.gsub(/[\$\,]/, "").to_f)
  end
end
