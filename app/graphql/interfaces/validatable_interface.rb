module Interfaces::ValidatableInterface
  include Types::BaseInterface
  description "Error and validation fields for elements that can be created"

  field :errors, [String, null: true], "Reasons the object couldn't be created or updated", null: true
  field :error_messages, String, "rails error object", null: true
  field :valid, Boolean, null: false

  def errors
    object.errors.full_messages
  end

  def valid
    object.valid?
  end

  def error_messages
    object.errors&.to_json
  end
end
