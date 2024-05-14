class Types::InvoiceResponse < Types::BaseResponse
  description "A repsonse to a mutation with and Invoice"

  field :success, Boolean, null: false
  field :error_messages, [String], null: true
  field :invoice, Types::InvoiceType, null: true
end
