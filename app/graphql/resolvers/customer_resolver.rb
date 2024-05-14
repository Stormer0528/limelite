module Resolvers
  class CustomerResolver < Resolvers::BaseSearchResolver
    type types[Types::CustomerType]
    description "Find Customers"

    scope { context[:current_org] ? context[:current_org].customers.order_by_name : Customer.all }

    # Options
    option(:aasm_state, type: types.String, )
    option(:name, type: types.String) {|scope, value| scope.by_partial_name(value) unless value.blank? }
    option(:number, type: types.String) {|scope, value| scope.by_partial_number(value) unless value.blank? }
  end
end
