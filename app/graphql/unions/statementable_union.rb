class Unions::StatementableUnion < Unions::BaseUnion
  graphql_name "Statementable"
  description "BankAccount or Credit Card for Statement"
  possible_types Types::BankAccountType, Types::CreditCardType

  def self.resolve_type(object, _ctx)
    if object.is_a?(BankAccount)
      Types::BankAccountType
    elsif object.is_a?(CreditCard)
      Types::CreditCardType
    end
  end
end
