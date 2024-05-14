class Types::CheckType < Types::BaseObject
  implements Interfaces::BankItemInterface
  implements Interfaces::ValidatableInterface

  include Concerns::Permissable
  include Concerns::ApprovableWithLog

  field :memo, String, null: true
  field :payee, String, null: true
  field :number, String, null: true
  field :check_type, String, null: true
  field :entry, Types::EntryType, null: true
  field :printed, Boolean, null: false
  field :voided, Boolean, null: false
  field :address_id, ID, null: true
  field :entry_items_fund_code_totals, String, null: true
  field :creator, Types::UserType, null: true
  field :bank_account, Types::BankAccountType, null: true

  field :invoices, [Types::InvoiceType], null: false

  def printed
    object.printed?
  end

  def voided
    object.voided?
  end

  def entry_items_fund_code_totals
    object.entry_items_fund_code_totals.to_json
  end
end
