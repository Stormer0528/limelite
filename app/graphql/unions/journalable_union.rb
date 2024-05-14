class Unions::JournalableUnion < Unions::BaseUnion
  graphql_name "JournalableUnion"
  description "items attached to a (journal) entry"
  possible_types Types::InvoiceType, Types::PaymentType

  def self.resolve_type(object, _ctx)
    if object.is_a?(Payment)
      Types::PaymentType
    elsif object.is_a?(Invoice)
      Types::InvoiceType
    else
      "Types::#{object.class.name}".safe_constantize
    end
  end
end
