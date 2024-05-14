class Types::AccountTransferType < Types::BaseObject
  implements Interfaces::BankItemInterface
  implements Interfaces::ValidatableInterface

  include Concerns::Permissable
  include Concerns::ApprovableWithLog

  field :number, String, null: true
  field :memo, String, null: true
  field :entry, Types::EntryType, null: true
  field :from_bank_account_id,   String, null: true
  field :from_bank_account_name, String, null: true
  field :to_bank_account_id,     String, null: true
  field :to_bank_account_name,   String, null: true
  field :bank_account_name,      String, null: true
  field :is_from_account_item,   Boolean, null: true
  field :is_to_account_item,     Boolean, null: true

  field :creator, Types::UserType, null: true
  field :bank_account, Types::BankAccountType, null: true

  field :path, String, null: true
  field :edit_path, String, null: true

  def from_bank_account_id
    object.from_bank_account_item&.id
  end

  def from_bank_account_name
    object.from_bank_account_item&.bank_account_name
  end

  def to_bank_account_id
    object.to_bank_account_item&.id
  end

  def to_bank_account_name
    object.to_bank_account_item&.bank_account_name
  end

  def is_from_account_item
    object.from_bank_account_item?
  end

  def is_to_account_item
    object.to_bank_account_item?
  end

  def path
    "/bank_accounts/#{object.bank_account.slug}/account_transfers/#{object.id}"
  end

  def edit_path
    "/bank_accounts/#{object.bank_account.slug}/account_transfers/#{object.id}/edit"
  end

  def number
    object.id
  end
end
