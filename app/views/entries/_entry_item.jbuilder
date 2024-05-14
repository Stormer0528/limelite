json.extract! entry_item, :id, :type, :account_id, :amount_in_cents, :aasm_state, :memo
json.date entry_item.date&.to_time
json.entry_type entry_item.type
json.amount entry_item&.amount.to_f&.abs
json.name   entry_item.account&.name
json.accountName   entry_item.account&.name
json.entry_item_id entry_item.id
json.valid true

json.accountId entry_item&.account&.id
json.fundCode entry_item&.account&.account_fund_code
json.functionCode entry_item&.account&.account_function_code
json.goalCode entry_item&.account&.account_goal_code
json.locationCode entry_item&.account&.account_location_code
json.objectCode entry_item&.account&.account_object_code
json.resourceCode entry_item&.account&.account_resource_code
json.yearCode entry_item&.account&.account_year_code

json.payableId entry_item&.payable_id
json.payableType entry_item&.payable_type
json.payableName entry_item&.payable&.display_name

json.validation_errors entry_item&.errors&.full_messages

json.entry_path (entry_item.entry.id ? entry_path(entry_item.entry) : "")
json.credit (entry_item.type == "Credit" ? entry_item&.amount.to_f&.abs : "")
json.debit  (entry_item.type == "Debit"  ? entry_item&.amount.to_f&.abs : "")

# json.entry_path entry_path(entry_item.entry)
