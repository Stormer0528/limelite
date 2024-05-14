module Resolvers
  class OrganizationResolver < Resolvers::BaseSearchResolver
    type types[Types::OrganizationType]
    description "Find Organization"

    scope { context[:current_user] ? context[:current_user].organizations : Organization.all }
  end
end
