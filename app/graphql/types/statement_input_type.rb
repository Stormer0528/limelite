class Types::StatementInputType < Types::BaseInputObject
  graphql_name "StatementInputType"
  description "Properties for creating a Statement"

  argument :statement_id, ID, required: false
  argument :statementable_id, ID, required: true
  argument :statementable_type, String, required: true

  argument :adjustment_amount, String, required: false
  argument :adjustment_date, String, required: false

  argument :started_at, String, required: true
  argument :ended_at, String, required: true

  argument :starting_balance, String, required: true
  argument :ending_balance, String, required: true

  argument :file_url, String, required: false
  argument :item_ids, [ID], required: false

  argument :state_action, String, required: false
end
