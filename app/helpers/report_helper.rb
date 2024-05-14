# app/helpers/report_helper.rb

module ReportHelper
  def get_changes_price(current_balance, before_balance)
    current = parse_num(current_balance)
    before = parse_num(before_balance)

    return Money.new((current - before) * 100).format
  end

  def get_changes_percentage(current_balance, before_balance)
    current = parse_num(current_balance)
    before = parse_num(before_balance)

    if before != 0
      change_rate = (current - before) / before * 100
      return "#{change_rate.round(2)}%"
    end

    return "0%"
  end

  def parse_num(num)
    num = num.gsub(/[$,]/, '') if num.is_a? String
    num.to_f
  end
end
