json.extract! bank_account, :id, :pseudo, :number, :name, :description, :edp_number, :state_account_number, :created_at, :updated_at, :slug
json.balance bank_account.balance.format(sign_before_symbol: true).to_s
json.starting_balance bank_account.starting_balance.format(sign_before_symbol: true).to_s
json.last_statement_balance bank_account.last_statement_balance.format(sign_before_symbol: true).to_s
json.path bank_account_url(bank_account)
json.edit_path edit_bank_account_url(bank_account)
json.objectCode bank_account.object_code
json.objectId   bank_account.account_object_id
json.objectName bank_account.object_name
json.ended_at bank_account.ended_at&.to_time
json.started_at bank_account.started_at&.to_time

# Permissions
json.partial! "shared/standard_permissions", item: bank_account

json.statements do
  json.array! bank_account.statements.order(started_at: :desc) do |statement|
    json.partial! partial: "statements/show",
      locals: {statement: statement, bank_account: bank_account}
  end
end
