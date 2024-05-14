# == Schema Information
#
# Table name: report_budget_vs_actual_reports
#
#  id              :bigint(8)        not null, primary key
#  start_date      :date
#  end_date        :date
#  data            :jsonb
#  organization_id :bigint(8)
#  account_fund_id :bigint(8)
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#
# Indexes
#
#  index_report_budget_vs_actual_reports_on_account_fund_id  (account_fund_id)
#  index_report_budget_vs_actual_reports_on_organization_id  (organization_id)
#
# Foreign Keys
#
#  fk_rails_...  (account_fund_id => account_funds.id)
#  fk_rails_...  (organization_id => organizations.id)
#

class Report::BudgetVsActualReport < ApplicationRecord
  # CALLBACKS
  #-----------------------------------------------------------------------------
  after_create :run_report

  # RELATIONSHIPS
  #-----------------------------------------------------------------------------
  belongs_to :organization
  delegate :name, :id, to: :organization, prefix: true
  store_accessor  :data, :account_search_params, :account_funds,
                  :excess_revenues, :revenue_total, :expenditures_total

  Categories = {
    revenue: {
      :"8000-8099" => "Revenue Limit Sources",
      :"8100-8299" => "Federal Revenue",
      :"8300-8599" => "Other State Revenue",
      :"8600-8799" => "Other Local Revenue",
      :"8900-8929" => "Interfund Transfers In",
    },
    expenditures: {
      :"1000" => "Certificated Salaries",
      :"2000" => "Classified Salaries",
      :"3000" => "Employee Benefits",
      :"4000" => "Books and Supplies",
      :"5000" => "Other Services and Operations",
      :"6000" => "Capital Outlay",
      :"7000" => "Other / Direct / Indirect",
    }
  }.freeze

  def run_report(should_save=true)
    self.data ||= Hash.new

    data[:fiscal_year] = end_date ? FiscalYear.get_year(end_date) : FiscalYear.get_year
    data[:report_date] = Date.today.to_formatted_s(:std)

    # Note: account_search_params is not passed directly from the mutation ... only shows up in data
    account_search_params ||= data["account_search_params"] || {}
    account_search_params && account_search_params.transform_values! {|v| parse_list_range_field(v)}

    data[:account_funds] = get_account_funds
    data[:fund_code] = account_fund_code
    data[:fund_name] = account_fund_name

    Report::BudgetVsActualReport::Categories.each do |category_type, obj|
      data[category_type] = {}
      total_total = []
      account_fund_range_totals = account_fun_obj

      obj.each do |range, title|
        ranges = range.to_s.split("-")
        account_range = Range.new(ranges[0]&.to_i, ranges[1]&.to_i || ranges[0]&.to_i + 999)
        account_objects = AccountObject.where(organization_id: organization.id, code: account_range).order(code: :asc)

        data[category_type][range] = {title: title, accounts: []}
        obj_account_fund_totals = account_fun_obj

        # Calculate total per fund
        account_objects.each do |account_object|
          obj_account_funds = {}
          fund_balances = []
          data[:account_funds].each do |fund|
            bal = account_object.balance(start_date, end_date, account_search_params&.merge(fund_code: fund.code))
            obj_account_funds[fund.code.to_sym] = bal.format
            fund_balances << bal
            obj_account_fund_totals[fund.code.to_sym] << bal
          end

          budget_amount   = account_budgets_totals(account_object.code, data[:fiscal_year])
          account_balance = fund_balances.inject(Money.new(0)) {|total, balance| total + balance }
          account_percentage = budget_amount.zero? ? 0.0 : (((account_balance - budget_amount) / budget_amount) * 100).round(2)

          # underlying accounts for budget calculation
          account_object_accounts = Account::AccountSearch.new(
            scope:   organization.accounts,
            filters: account_search_params.merge(object_code: account_object.code)
          ).results

          accounts = account_object_accounts.map do |acc|
            acc.start_date = start_date
            acc.end_date   = end_date
            acc_budget = acc.current_budget(data[:fiscal_year])
            acc_balance = acc.approved_balance
            acc_diff = acc_budget - acc_balance
            acc_percentage = acc_budget.zero? ? 0.0 : (((acc_balance - acc_budget) / acc_budget) * 100).round(2)

            { number: acc.number,
              budget: acc_budget.format,
              balance: acc_balance.format,
              variance: acc_diff.format,
              percentage: acc_percentage }
          end

          data[category_type][range][:accounts].push({ \
            name: account_object.name,
            code: account_object.code,
            budget: budget_amount.format,
            dollar_variance: (budget_amount - account_balance).format,
            percentage_variance: account_percentage,
            account_funds: obj_account_funds,
            balance: account_balance.format,
            accounts: accounts \
            })
        end

        # Get total for account objects range per fund
        total_account_funds = {}
        total_range_funds = []
        data[:account_funds].each do |fund|
          total_balance = obj_account_fund_totals[fund.code.to_sym].inject(Money.new(0)) {|total, balance| total + balance }
          total_account_funds[fund.code.to_sym] = total_balance.format
          total_range_funds << total_balance
          account_fund_range_totals[fund.code.to_sym] << total_balance
        end



        data[category_type][range][:funds_balances] = total_account_funds


        # Get total for all account objects
        total_range_balance = total_range_funds.inject(Money.new(0)) {|total, balance| total + balance }
        data[category_type][range][:total_balance] = total_range_balance&.format

        range_str = range =~ /-/ ? range : "#{range}-#{range.to_s.to_i + 999}"
        total_budget = account_budgets_totals(range_str, data[:fiscal_year])

        data[category_type][range][:total_budget] = total_budget.format
        data[category_type][range][:total_account_balance] = (total_budget - total_range_balance).format
        data[category_type][range][:total_account_percentage] = total_budget.zero? ? 0 : ((total_range_balance / total_budget) * 100).round(2)

        total_total.push(total_range_balance)
      end

      obj_range_totals = {}
      data[:account_funds].each do |fund|
        obj_range_totals[fund.code.to_sym] = account_fund_range_totals[fund.code.to_sym].inject(Money.new(0)) {|total, balance| total + balance }
      end

      range_budget_total = range_budget_total(data[category_type])

      data[:"#{category_type}_range_totals"] = obj_range_totals
      data[:"#{category_type}_total"] = total_total.inject(Money.new(0)) {|total, balance| total + balance }
      data[:"#{category_type}_budget_total"] = range_budget_total.format
      data[:"#{category_type}_account_balance_total"] = (range_budget_total - data[:"#{category_type}_total"]).format
      data[:"#{category_type}_account_balance_percentage"] = range_budget_total.zero? ? 0 : (((data[:"#{category_type}_total"] - range_budget_total) / range_budget_total) * 100).round(2)
    end
    excess_revenues_totals = {}

    data[:account_funds].each do |fund|
      revenue      = data[:"revenue_range_totals"][fund.code.to_sym]
      expenditures = data[:"expenditures_range_totals"][fund.code.to_sym]

      # Set excess total
      excess_revenues_totals[fund.code.to_sym] = (revenue - expenditures)&.format

      # format returned values
      data[:"revenue_range_totals"][fund.code.to_sym] = revenue&.format
      data[:"expenditures_range_totals"][fund.code.to_sym] = expenditures&.format
    end

    data[:excess_revenues_totals] = excess_revenues_totals
    data[:excess_revenues] = (data[:revenue_total] - data[:expenditures_total])&.format
    data[:excess_revenues_budget] = excess_revenues_budget(data)&.format
    data[:excess_revenues_account_balance] = excess_revenues_account_balance(data)&.format


    data[:revenue_total] = data[:revenue_total]&.format
    data[:expenditures_total] = data[:expenditures_total]&.format

    save if should_save
  end

  def subtitle
    "Budget vs. Actual Report"
  end

  def get_account_funds
    filter_val = account_search_params && account_search_params[:fund_code]

    if filter_val.is_a? String
      filter_val = filter_val.split(",")
      filter_val = filter_val.map {|val| (val =~ /\.\.\.|-/) ? Range.new(*val.split(/\.\.\.|-/).map(&:to_i)) : val}
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

  def excess_revenues_budget(data)
    Money.from_amount(parse_num(data[:revenue_budget_total]) - parse_num(data[:expenditures_budget_total]))
  end

  def excess_revenues_account_balance(data)
    excess_revenues_budget(data) - Money.from_amount(parse_num(data[:excess_revenues]))
  end

  def account_fund_code
    (data&.with_indifferent_access&.dig(:account_funds) || []).map {|fund| fund[:code] }.join(", ")
  end

  def account_fund_id
    (data&.with_indifferent_access&.dig(:account_funds) || []).map {|fund| fund[:id] }.join(", ")
  end

  def parse_list_range_field(filter_val)
    if filter_val.is_a? String
      filter_val = filter_val.split(",").map(&:strip)
      filter_val = filter_val.map {|val| (val =~ /\.\.\.|-/) ? Range.new(*val.split(/\.\.\.|-/).map(&:to_i)) : val}
    end

    filter_val
  end

  def account_fun_obj
    data[:account_funds].inject(Hash.new) {|obj, fund| obj[fund.code.to_sym] = []; obj}
  end

  def account_budgets_totals(fund_search, fiscal_year)
    # filter by account string
    object_code = parse_list_range_field(fund_search.to_s)
    filter = account_search_params.merge(object_code: object_code)

    accounts = Account::AccountSearch.new(scope: organization.accounts, filters: filter).results
    accounts.map {|obj| obj.current_budget(fiscal_year) }.inject(Money.new(0)) {|sum, amt| sum + amt }
  end

  def range_budget_total(category_type_range)
    category_type_range
      .keys.map {|key| Money.from_amount parse_num(category_type_range[key][:total_budget])}
      .inject(Money.new(0)) {|sum, amt| sum + amt }
  end

  def colspan_width
    (get_account_funds&.length || 0) + 7
  end

  def parse_num(num)
    num.gsub(/[\$\,]/, "").to_f
  end
end
