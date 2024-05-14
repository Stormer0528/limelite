Types::EntryItemInputType = GraphQL::InputObjectType.define do
  name "EntryItemInput"
  description "Properties for creating a EntryItem"

  argument :name,   types.String
  argument :amount, !types.Float
  argument :entry_type, !types.String
  argument :memo, types.String
  argument :payable_id, types.String
  argument :payable_type, types.String

  argument :account_id, types.ID

  argument :account_function_id, types.Int
  argument :account_fund_id,     types.Int
  argument :account_goal_id,     types.Int
  argument :account_location_id, types.Int
  argument :account_object_id,   types.Int
  argument :account_resource_id, types.Int
  argument :account_year_id,     types.Int

  argument :function_code, types.ID
  argument :fund_code,     types.ID
  argument :goal_code,     types.ID
  argument :location_code, types.ID
  argument :object_code,   types.ID
  argument :resource_code, types.ID
  argument :year_code,     types.ID
end
