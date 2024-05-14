##
# Common functions for All Reports
module Reports
  module ProfitAndLossReportable
    extend ActiveSupport::Concern

    def parse_account_range(range)
      ranges = range.to_s.split(",")
      ranges.map do |r|
        range = r.to_s.split("-")
        Range.new(range[0]&.to_i, range[1]&.to_i || range[0]&.to_i + 999)
      end
    end

    def aggregate_total(section)
      return @default_row if section.empty?

      section.first.keys.each_with_object({}) do |code, ret|
        next(ret) unless code.respond_to? :to_sym
        next(ret) if %i[code description].include? code.to_sym

        ret[code] = section.inject(Money.new(0)) {|total, obj| total + parse_amount(obj[code]) }.format
      end
    end

    def aggregate_range_total(section, types = {})
      return @default_row if section.empty?

      ret = {}

      section.each do |range, value|
        balances = value[:balances]

        balances.each do |code, amount|
          next(ret) unless code.respond_to? :to_sym
          next(ret) if %i[code description].include? code.to_sym

          type = types.fetch(range, 'Revenue')

          if !ret.has_key?(code)
            ret[code] = Money.new(0)
          end

          if type == 'Revenue'
            ret[code] = ret[code] + parse_amount(amount)
          else
            ret[code] = ret[code] - parse_amount(amount)
          end
        end
      end

      ret.keys.each do |code|
        ret[code] = ret[code].format
      end

      return ret
    end

    def calculate_excess_revenues!
      revenues = data[:revenues_range_totals]
      expenses = data[:expenses_range_totals]

      data[:excess_revenues_totals] = revenues.keys.each_with_object({}) do |code, ret|
        next(ret) if %i[code description].include? code.to_sym

        revenue_value = parse_amount(revenues[code])
        expense_value = parse_amount(expenses[code])

        ret[code] = (revenue_value - expense_value).format
      end
    end

    def calculate_net_position!
      excess_revenues = data[:excess_revenues_totals]
      other_financing = data[:other_financing_range_totals]

      data[:net_position_totals] = excess_revenues.keys.each_with_object({}) do |code, ret|
        next(ret) if %i[code description].include? code.to_sym

        excess_revenue_value = parse_amount(excess_revenues[code])
        other_financing_value = parse_amount(other_financing[code])

        ret[code] = (excess_revenue_value + other_financing_value).format
      end
    end

    def normalize_data!
      attributes["data"].deep_symbolize_keys!
    end
  end
end
