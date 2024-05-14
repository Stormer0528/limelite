require "search_object"
require "search_object/plugin/graphql"

class Resolvers::BaseSearchResolver
  include SearchObject.module(:graphql)

  def escape_search_term(term)
    "%#{term.gsub(/\s+/, '%')}%"
  end

  def parse_list_field(value)
    value.split(",").map(&:strip)
  end
end
