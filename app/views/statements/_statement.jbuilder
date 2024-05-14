json.extract! statement, :id, :file_url, :starting_balance_in_cents, :aasm_state, :ending_balance_in_cents, :statementable_type, :statementable_id, :created_at, :updated_at

json.started_at statement.started_at&.to_time
json.ended_at   statement.ended_at&.to_time

# Balances
json.starting_balance statement.starting_balance.format(sign_before_symbol: true).to_s
json.ending_balance   statement.ending_balance.format(sign_before_symbol: true).to_s

# Users
json.preparer statement.creator&.full_name
json.creator  statement.creator&.full_name

json.reconciliations do
  json.array!(statement.reconciliations) do |reconciliation|
    json.id reconciliation.id
    json.organization_id reconciliation.organization_id
    json.reconcilable_id reconciliation.reconcilable_id
    json.statement_id reconciliation.statement_id
    json.created_at reconciliation.created_at
    json.updated_at reconciliation.updated_at
    json.reconcilable_item_id reconciliation.reconcilable_item_id
    json.reconcilable_item_type reconciliation.reconcilable_item_type
    json.reconcilable_type reconciliation.reconcilable_type
  end
end

# Paths
# json.show_path "bank_accounts/#{bank_account.slug}/statements/#{statement.id}"

# Permissions
# json.partial! "shared/permissions", item: statement
