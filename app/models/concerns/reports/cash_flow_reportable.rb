module Reports
  module CashFlowReportable
    extend ActiveSupport::Concern

    # Investing Activities
    # 94X0
    def investing_activities
      organization.account_objects.where("account_objects.code ILIKE '94%0'")
    end

    # Financing Activities
    # 966X
    # 9793
    # 9795
    def financing_activities
      organization.account_objects.where("account_objects.code ILIKE '966%' OR account_objects.code IN ('9793', '9795')")
    end

    # Other Income
    # 9200-9799 (not including above)
    def other_income
      organization.account_objects.where(account_objects: {code: 9200..9799}).where("account_objects.code NOT ILIKE '94%0'").where("account_objects.code NOT ILIKE '966%' AND account_objects.code NOT IN ('9793', '9795')")
    end

    def cash_accounts_total(start_date, end_date)
      organization.account_objects.cash_accounts.map {|account| account.balance(start_date, end_date)}.inject(Money.new 0) {|balance, sum| balance + sum}
    end

    def beginning_of_fiscal_year
      Date.parse "#{(start_date.month > 7) ? start_date.year : start_date.year - 1}-07-01"
    end

    def parse_list_range_field(filter_val)
      if filter_val.is_a? String
        filter_val = filter_val.split(",").map(&:strip)
        filter_val = filter_val.map {|val| (val =~ /\.\.\.|-/) ? Range.new(*val.split(/\.\.\.|-/).map(&:to_i)) : val}
      end

      filter_val
    end
  end
end
