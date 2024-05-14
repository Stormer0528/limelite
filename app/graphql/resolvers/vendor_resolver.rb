module Resolvers
  class VendorResolver < Resolvers::BaseSearchResolver
    type types[Types::Vendor]
    description "Find Vendors"

    scope { Pundit.policy_scope(context[:auth_ctx], Vendor).where(organization: context[:current_org]).order_by_name }

    # Options
    option(:aasm_state, type: types.String)
    option(:name, type: types.String) {|scope, value| scope.by_partial_name(value) if value }
    option(:number, type: types.String) {|scope, value| scope.by_partial_number(value) if value }
  end
end
