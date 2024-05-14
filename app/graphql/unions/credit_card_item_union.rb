class Unions::CreditCardItemUnion < Unions::BaseUnion
  graphql_name "CreditCardItem"
  description "Charge and Payment for Credit Card account"
  possible_types Types::CreditCardChargeType, Types::CreditCardPaymentType

  def self.resolve_type(object, _ctx)
    if object.is_a?(CreditCard::Charge)
      Types::CreditCardChargeType
    elsif object.is_a?(CreditCard::Payment)
      Types::CreditCardPaymentType
    end
  end
end
