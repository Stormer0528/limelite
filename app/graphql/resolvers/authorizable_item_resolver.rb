module Resolvers
  class AuthorizableItemResolver < Resolvers::BaseSearchResolver
    include SearchObject.module(:graphql)

    type types[Unions::AuthorizableUnion]
    description "Find Authorizable Items"

    scope { context[:current_user].authorizable_items(context[:current_org].id) }
  end
end
