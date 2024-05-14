class Types::AccountTransferResponse < Types::BaseObject
  description "A Basic repsonse to a mutation"

  field :success, Boolean, null: false
  field :error_messages, [String], null: true
  field :account_transfer, Types::AccountTransferType, null: true
end
