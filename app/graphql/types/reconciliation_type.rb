class Types::ReconciliationType < Types::BaseObject
  graphql_name "Reconciliation"
  description "Reconciliation record for Bank Account item or Credit Card"

  field :id, ID, null: false
  field :organization_id, ID, null: false
  field :reconcilable_id, ID, null: false
  field :reconcilable_type, String, null: false
  field :reconcilable_item_id, ID, null: false
  field :reconcilable_item_type, String, null: false
  field :statement_id, ID, null: false
  field :entry_id, ID, null: true

  field :organization, Types::OrganizationType, null: true
  field :entry, Types::EntryType, null: true
  field :statement, Types::StatementType, null: true
  field :reconcilable, Unions::ReconcilableUnion, null: true
  field :reconcilable_item, Unions::ReconcilableItemUnion, null: true
end
