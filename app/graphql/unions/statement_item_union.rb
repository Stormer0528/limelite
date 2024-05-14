class Unions::StatementItemUnion < Unions::BaseUnion
  graphql_name "StatementItem"
  description "Check, Deposit, Transfers for bank account or Credit Card Payment or Charge"
  possible_types Types::CheckType, Types::DepositType, Types::AccountTransferType, Types::CreditCardChargeType, Types::CreditCardPaymentType

  def self.resolve_type(object, _ctx)
    if object.is_a?(CreditCard::Charge)
      Types::CreditCardChargeType
    elsif object.is_a?(CreditCard::Payment)
      Types::CreditCardPaymentType
    elsif object.is_a?(BankAccount::Check)
      Types::CheckType
    elsif object.is_a?(BankAccount::Deposit)
      Types::DepositType
    elsif object.is_a?(BankAccount::AccountTransfer)
      Types::AccountTransferType
    end
  end
end
