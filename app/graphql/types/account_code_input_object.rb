class Types::AccountCodeInputObject < GraphQL::Schema::InputObject
  argument :fund_code, String, required: false
  argument :resource_code, String, required: false
  argument :year_code, String, required: false
  argument :goal_code, String, required: false
  argument :function_code, String, required: false
  argument :object_code, String, required: false
  argument :location_code, String, required: false

  def self.parse_account_funds(funds)
    filter_val = funds

    if !filter_val.nil? and filter_val.is_a? String
      filter_val = filter_val.split(",")
      filter_val = filter_val.map {|val| val =~ /\.\.\.|-/ ? Range.new(*val.split(/\.\.\.|-/).map(&:to_i)) : val}
    end

    return filter_val
  end

  def self.intersect_funds(a, b)
    if b.nil? or b.length == 0
      return a
    elsif a.nil? or a.length == 0
      return b
    else
      a1 = a.map { |item| (item.is_a? String) ? item.to_i : item }
      b1 = b.map { |item| (item.is_a? String) ? item.to_i : item }
      intersection = []

      a1.each do |item1|
        existing = b1.select { |item2| item1 === item2 }
        unless existing.length == 0
          intersection.push(item1.to_s)
        end
      end

      return intersection.sort
    end
  end
end
