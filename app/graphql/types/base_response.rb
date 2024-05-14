class Types::BaseResponse < Types::BaseObject
  description "A Basic repsonse to a mutation"

  field :success, Boolean, null: false
  field :error_messages, [String], null: true
end
