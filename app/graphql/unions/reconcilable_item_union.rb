class Unions::ReconcilableItemUnion < Unions::BaseUnion
  graphql_name "ReconcilableItem"
  description "Bank Account Item or Credit Card Item that was Reconciled"
  possible_types Types::CreditCardChargeType,
                 Types::CreditCardPaymentType,
                 Types::DepositType,
                 Types::CheckType,
                 Types::AccountTransferType

  def self.resolve_type(object, _ctx)
    # Credit Card Items
    if object.is_a?(CreditCard::Charge)
      Types::CreditCardChargeType
    elsif object.is_a?(CreditCard::Payment)
      Types::CreditCardPaymentType
    # Bank Account Items
    elsif object.is_a?(BankAccount::Deposit)
      Types::DepositType
    elsif object.is_a?(BankAccount::Check)
      Types::CheckType
    elsif object.is_a?(BankAccount::Transfer)
      Types::AccountTransferType
    end
  end
end
