class Types::DepositType < Types::BaseObject
  implements Interfaces::BankItemInterface
  implements Interfaces::ValidatableInterface

  include Concerns::Permissable
  include Concerns::ApprovableWithLog

  field :memo, String, null: true
  field :number, String, null: true
  field :entry, Types::EntryType, null: true
  field :creator, Types::UserType, null: true
  field :bank_account, Types::BankAccountType, null: true
end
