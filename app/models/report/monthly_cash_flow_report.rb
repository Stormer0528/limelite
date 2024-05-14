# == Schema Information
#
# Table name: report_monthly_cash_flow_reports
#
#  id              :bigint(8)        not null, primary key
#  start_date      :date
#  end_date        :date
#  data            :jsonb            not null
#  organization_id :bigint(8)
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#
# Indexes
#
#  index_report_monthly_cash_flow_reports_on_organization_id  (organization_id)
#
# Foreign Keys
#
#  fk_rails_...  (organization_id => organizations.id)
#

class Report::MonthlyCashFlowReport < ApplicationRecord
  include Reports::MonthlyReportable
  include Reports::CashFlowReportable

  store_accessor  :data, :cash_at_beginning, :cash_at_end, :financing_activities,
                  :financing_activities_total, :fiscal_year, :investigating_activities,
                  :investing_activities, :investing_activities_total,
                  :net_cash, :net_cash_increase, :net_income, :net_operations_cash,
                  :other_income, :other_income_total, :report_date,
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

    self.account_search_params = account_search_params&.symbolize_keys
    self.data ||= {}
    account_search_params && account_search_params.transform_values! {|v| parse_list_range_field(v)}
    data["fiscal_year"] = (end_date.month >= 7) ? end_date.year : end_date.year + 1
    data["report_date"] = Date.today.to_formatted_s(:std)
    data["fund_code"] = account_search_params[:fund_code].join(', ')
    data["net_income"] = []

    data["investing_activities"] = []
    data["financing_activities"] = []
    data["other_income"] = []
    data["investing_activities_total"] = []
    data["financing_activities_total"] = []
    data["other_income_total"] = []
    data["net_cash_increase"] = []
    data["cash_at_beginning"] = []
    data["cash_at_end"] = []
    data["net_cash"] = []
    data["net_operations_cash"] = []

    investing_activities.each do |acc_obj|
      obj = {name: acc_obj.name, code: acc_obj.code, balances: []}

      months.each do |month|
        balance = acc_obj.balance(month, month.end_of_month, account_search_params)
        obj[:balances] << balance.format
      end

      data["investing_activities"] << obj unless obj[:balances].all? {|bal| bal == "$0.00"}
    end

    months.each do |month|
      data["investing_activities_total"] << investing_activities.map{|acc_obj| acc_obj.balance(month, month.end_of_month, account_search_params)}.inject(Money.new(0)){|sum, balance| sum + balance}.format
    end

    financing_activities.each do |acc_obj|
      obj = {name: acc_obj.name, code: acc_obj.code, balances: []}

      months.each do |month|
        balance = acc_obj.balance(month, month.end_of_month, account_search_params)
        obj[:balances] << balance.format
      end

      data["financing_activities"] << obj unless obj[:balances].all? {|bal| bal == "$0.00"}
    end

    months.each do |month|
      data["financing_activities_total"] << financing_activities.map{|acc_obj| acc_obj.balance(month, month.end_of_month, account_search_params)}.inject(Money.new(0)){|sum, balance| sum + balance}.format
    end

    other_income.each do |acc_obj|
      obj = {name: acc_obj.name, code: acc_obj.code, balances: []}

      months.each do |month|
        balance = acc_obj.balance(month, month.end_of_month, account_search_params)
        obj[:balances] << balance.format
      end

      data["other_income"] << obj unless obj[:balances].all? {|bal| bal == "$0.00"}
    end

    months.each do |month|
      data["other_income_total"] << other_income.map{|acc_obj| acc_obj.balance(month, month.end_of_month, account_search_params)}.inject(Money.new(0)){|sum, balance| sum + balance}.format
    end

    data["investing_activities_total"].each.with_index do |invest, index|
      investing = Money.from_amount invest.gsub(/[\$\,]/, "").to_f
      financing = Money.from_amount data["financing_activities_total"][index].gsub(/[\$\,]/, "").to_f
      other = Money.from_amount data["other_income_total"][index].gsub(/[\$\,]/, "").to_f

      data["net_cash_increase"] << (investing + financing + other).format
    end

    months.each do |month|
      beginning_cash = cash_accounts_total(beginning_of_fiscal_year, month.beginning_of_month)
      ending_cash = cash_accounts_total(beginning_of_fiscal_year, month.end_of_month)
      data["cash_at_beginning"] << beginning_cash.format
      data["cash_at_end"] << ending_cash.format
      data["net_cash"] << (ending_cash - beginning_cash).format
    end

    months.each.with_index do |_month, index|
      income_cash = Money.from_amount data["other_income_total"][index].gsub(/[\$\,]/, "").to_f
      net_cash = Money.from_amount data["net_cash"][index].gsub(/[\$\,]/, "").to_f
      data["net_operations_cash"] << (net_cash - income_cash).format
    end

    save if should_save
  end
end
