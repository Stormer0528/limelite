class AccountCodeParser
  include ActiveModel::Model
  ELEMENTS = [:fund, :function, :goal, :location, :object, :resource, :year].freeze

  def self.max_length(elem_type)
    case elem_type.to_sym
    when :year then 1
    when :location then 2
    else; 4
    end
  end

  # Define Getters/Setters/Validations
  ELEMENTS.each do |elem|
    attr_accessor :"#{elem}_code"
    define_method :"#{elem}_code=", ->(code) {
      instance_variable_set(:"@#{elem}_code", cast(code, elem)) if code && !code.strip.empty?
    }
  end

  # Attributes for #as_json and #from_json
  def attributes
    Hash[ELEMENTS.map {|elem| [:"#{elem}_code", nil] }]
  end

  def attributes=(hash)
    hash.each do |key, value|
      send("#{key}=", value)
    end
  end

  def empty?
    [fund_code, function_code, goal_code, location_code, object_code, resource_code, year_code].none?
  end

  def to_h
    hash = {}
    ELEMENTS.each do |elem|
      code = :"#{elem}_code"
      hash[code] = send(code) if send(code)&.present?
    end
    hash
  end

  # HELPER METHODS
  #-----------------------------------------------------------------------------
  def cast(val, code_type)
    parse_range \
      parse_partial_value \
        parse_list(val),
        code_type
  end

  # Code Parsers
  #-----------------------------------------------------------------------------
  def parse(val, &block)
    if val.is_a?(Array)
      val.map(&block)
    else
      yield val
    end
  end

  def parse_list(value)
    return value unless value.is_a?(String) || value.is_a?(Array)

    parsed_value = parse(value) do |val|
      val.is_a?(String) ? val.split(",").map(&:strip) : val
    end

    return parsed_value[0] if parsed_value.is_a?(Array) && parsed_value.length == 1
    return parsed_value.flatten if parsed_value.is_a?(Array)

    parsed_value
  end

  def parse_partial_value(value, code_type)
    max_code_length = self.class.max_length(code_type)

    parse(value) do |val|
      next val unless val.is_a?(String) && val.length < max_code_length

      Range.new(
        val.ljust(max_code_length, "0").to_i,
        val.ljust(max_code_length, "9").to_i
      )
    end
  end

  def parse_range(value)
    parse(value) do |val|
      if val.is_a?(String) && val =~ /\.\.\.?|-/
        Range.new(*val.split(/\.\.\.?|-/).map(&:to_i))
      else
        val
      end
    end
  end
end
