# == Schema Information
#
# Table name: report_dashboards
#
#  id                  :bigint(8)        not null, primary key
#  start_date          :date
#  end_date            :date
#  data                :jsonb
#  organization_id     :bigint(8)
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#
# Indexes
#
#  index_report_dashboards_on_organization_id  (organization_id)
#

class Report::Dashboard < ApplicationRecord
  include Reports::MonthlyReportable

  store_accessor  :data

  belongs_to :organization

  def run_report(should_save=true)
    profit_loss_report = Report::MonthlyProfitLossStatement.where(
      organization: organization, start_date: start_date, end_date: end_date
    ).where("data->>'fund_code' = ?", fund_code).first

    balance_sheet_by_month = Report::BalanceSheetByMonth.where(
      organization: organization, start_date: start_date, end_date: end_date
    ).where("data->>'fund_code' = ?", fund_code).first

    if profit_loss_report.nil?
      profit_loss_report = Report::MonthlyProfitLossStatement.new
    end

    if balance_sheet_by_month.nil?
      balance_sheet_by_month = Report::BalanceSheetByMonth.new
    end

    profit_loss_report.assign_attributes(
      organization: organization,
      start_date: start_date,
      end_date: end_date,
      account_search_params: {
        fund_code: fund_code.split(', ')
      }
    )

    balance_sheet_by_month.assign_attributes(
      organization: organization,
      start_date: start_date,
      end_date: end_date,
      account_search_params: {
        fund_code: fund_code.split(', ')
      }
    )

    if profit_loss_report.new_record?
      profit_loss_report.save
    # else
    #   profit_loss_report.run_report(true)
    end

    if balance_sheet_by_month.new_record?
      balance_sheet_by_month.save
    # else
    #   balance_sheet_by_month.run_report(true)
    end

    dashboard = {
      key_metrics: {},
      cash_balance: {},
      revenues: {},
      expenses: {},
      grants_table: {}
    }

    self.data = dashboard

    fiscal_year = start_date.year

    profit_loss_report.data["reports"].each do |fund_code, pl_report|
      balance_report = balance_sheet_by_month.data["reports"][fund_code]

      # key metrics
      net_income = {}
      db_titles.each_with_index do |month_code, index|
        net_income[month_code] = balance_report["net_income_loss_by_month"][index]
      end

      funds = fund_code
      if funds == 'all'
        funds = ''
      end

      key_metric = {
        expenses: pl_report["expenses_range_totals"],
        revenues: pl_report["revenues_range_totals"],
        net_income: net_income,

        budget: account_budgets_totals("", funds, fiscal_year).format,
        total_income: pl_report["revenues_range_totals"]["balance"],
        total_expense: pl_report["expenses_range_totals"]["balance"],
        total_net_income: balance_report["net_income_loss"],
        account_payable: balance_report["net_fund_balance"]
      }

      dashboard[:key_metrics][fund_code] = key_metric

      # cash balances
      cash_balances = {}
      total_income = 0
      total_outcome = 0

      total_cash = organization.account_objects.cash_accounts.map {|account| account.balance("", start_date, { fund_code: funds  })}.inject(Money.new 0) {|balance, sum| balance + sum}
      months.each do |month|
        income = 0
        outcome = 0

        organization.account_objects.cash_accounts.each do |account|
          balance = account.balance(month.beginning_of_month, month.end_of_month, { fund_code: funds  })

          if balance > 0
            income = income + balance
          else
            outcome = outcome + balance
          end
        end

        total_income = total_income + income
        total_outcome = total_outcome + outcome
        total_cash = total_cash + income + outcome

        cash_balances[month.strftime("%b_%y")] = total_cash.format
      end

      dashboard[:cash_balance][fund_code] = {
        cash_balances: cash_balances,
        total_income: Money.new(total_income).format,
        total_outcome: Money.new(total_outcome).format,
        total_cash: Money.new(total_cash).format
      }

      # revenue & expenses
      revenues = []
      pl_report["revenues"].each do |range, revenue|
        revenues.push({
          title: revenue["title"],
          actual: revenue["balances"]["balance"],
          budgeted: Money.new(account_budgets_totals(range, fund_code, fiscal_year)).format
        })
      end

      expenses = []
      pl_report["expenses"].each do |range, expense|
        expenses.push({
          title: expense["title"],
          balance: expense["balances"]["balance"],
          total_budget: Money.new(account_budgets_totals(range, fund_code, fiscal_year)).format
        })
      end

      dashboard[:revenues][fund_code] = revenues
      dashboard[:expenses][fund_code] = expenses

      # grants table
      grants = []
      expenditures = {
        :"1000" => "Certificated Salaries",
        :"2000" => "Classified Salaries",
        :"3000" => "Employee Benefits",
        :"4000" => "Books and Supplies",
        :"5000" => "Other Services and Operations",
        :"6000" => "Capital Outlay",
        :"7000" => "Other / Direct / Indirect",
      }

      total_balance = 0
      total_budget = 0

      expenditures.each do |range, title|
        range_str = range =~ /-/ ? range : "#{range}-#{range.to_s.to_i + 999}"
        account_objects = AccountObject.where(organization: organization, code: range)

        balance = 0
        account_objects.each do |object|
          balance = balance + object.balance(start_date, end_date, { fund_code: funds })
        end

        budget = account_budgets_totals(range_str, fund_code, fiscal_year)

        total_balance = total_balance + balance
        total_budget = total_budget + budget

        grants.push({
          title: title,
          actual: Money.new(balance).format,
          budget: Money.new(budget).format,
          diff: Money.new((budget - balance)).format,
          account_percentage: budget != 0 ? ((balance - budget) / budget * 100).round(2) : 0
        })
      end

      grants.unshift({
        title: 'Total',
        actual: Money.new(total_balance).format,
        budget: Money.new(total_budget).format,
        diff: Money.new(total_budget - total_balance).format,
        account_percentage: (total_budget != 0 ? (total_budget - total_balance) / total_budget * 100 : 0).round(2)
      })
      dashboard[:grants_table][fund_code] = grants
    end

    save if should_save
  end

  def account_budgets_totals(object_search, fund_search, fiscal_year)
    # filter by account string
    filter = {
      object_code: parse_list_range_field(object_search.to_s),
      fund_code: parse_list_range_field(fund_search.to_s)
    }

    accounts = Account::AccountSearch.new(scope: organization.accounts, filters: filter).results
    accounts.map {|obj| obj.current_budget(fiscal_year) }.inject(Money.new(0)) {|sum, amt| sum + amt }
  end

  def range_budget_total(category_type_range)
    category_type_range
      .keys.map {|key| Money.from_amount parse_num(category_type_range[key][:total_budget])}
      .inject(Money.new(0)) {|sum, amt| sum + amt }
  end

  private
  def parse_list_range_field(filter_val)
    if filter_val.is_a? String
      filter_val = filter_val.split(",").map(&:strip)
      filter_val = filter_val.map {|val| (val =~ /\.\.\.|-/) ? Range.new(*val.split(/\.\.\.|-/).map(&:to_i)) : val}
    end

    filter_val
  end

  def parse_num(num)
    num = num.gsub(/[$,]/, '') if num.is_a? String
    num.to_f
  end
end
