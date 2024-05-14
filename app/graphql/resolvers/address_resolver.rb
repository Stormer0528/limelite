module Resolvers
  class AddressResolver < Resolvers::BaseSearchResolver
    type types[Types::AddressType]

    description "Find Addresses"

    scope { Address.all }

    # Options
    option(:name, type: types.String)
    option(:addressable_type, type: types.String)
    option(:addressable_ids, type: types[types.ID]) {|scope, value| scope.where(addressable_id: value) }
    option(:addressable_id, type: types.ID)
  end
end
