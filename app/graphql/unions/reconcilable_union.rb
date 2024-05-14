class Unions::ReconcilableUnion < Unions::BaseUnion
  graphql_name "Reconcilable"
  description "Bank Account or Credit Card Being Reconciled"
  possible_types Types::CreditCardType, Types::BankAccountType

  def self.resolve_type(object, _ctx)
    if object.is_a?(BankAccount)
      Types::BankAccountType
    elsif object.is_a?(CreditCard)
      Types::CreditCardType
    end
  end
end
