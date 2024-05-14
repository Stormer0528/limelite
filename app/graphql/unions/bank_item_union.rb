class Unions::BankItemUnion < Unions::BaseUnion
  graphql_name "BankItem"
  description "Check, Deposit, Transfers for bank account"
  possible_types Types::CheckType, Types::DepositType, Types::AccountTransferType

  def self.resolve_type(obj, _ctx)
    case obj[:type]
    when "check"
      Types::CheckType
    when "BankAccount::Check"
      Types::CheckType
    when "deposit"
      Types::DepositType
    when "BankAccount::Deposit"
      Types::DepositType
    when "account_transfer"
      Types::AccountTransferType
    when "BankAccount::AccountTransfer"
      Types::AccountTransferType
    end
  end
end
