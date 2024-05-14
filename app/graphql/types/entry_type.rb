class Types::EntryType < Types::BaseObject
  implements Interfaces::ValidatableInterface
  include Concerns::Permissable
  include Concerns::ApprovableWithLog

  field :id, Integer, null: true
  field :organization_id, ID, null: true

  field :aasm_state, String, null: true
  field :amount, String, null: true
  field :backup_file_url, String, null: true
  field :count, Int, null: true
  field :date, String, null: true

  field :entry_items, [Types::EntryItemType, {null: true}], null: false
  field :entry_type, String, null: true

  field :journalable_id, ID, null: true
  field :journalable_path, String, null: true
  field :journalable_type, String, null: true
  field :journalable, Unions::JournalableUnion, null: true

  field :bank_account_items, [Interfaces::BankItemInterface, {null: true}], null: true
  field :credit_card_items,  [Interfaces::CreditCardItemInterface, {null: true}], null: true

  field :payable_name, String, null: true
  field :payable_path, String, null: true
  field :payable_type, String, null: true
  field :payments, [Types::PaymentType], null: true

  field :invoice, Types::InvoiceType, null: true

  field :total_credits, String, null: true
  field :total_debits, String, null: true

  field :edit_path, String, null: true
  field :path, String, null: true
  field :url, String, null: true
  field :file_url, String, null: true

  field :creator, Types::UserType, null: true
  field :created_at, String, null: true
  field :updated_at, String, null: true

  field :organization, Types::OrganizationType, null: false

  # Helper Methods
  #-----------------------------------------------------------------------------

  def entry_items
    object.persisted? ? object.entry_items.standard_ordering : object.entry_items
  end

  def amount
    object.amount.format
  end

  def total_credits
    object.total_credits.format
  end

  def total_debits
    object.total_debits.format
  end

  def path
    object&.id && "/entries/#{object.id}"
  end

  def edit_path
    object&.id && "#{path}/edit"
  end

  def url
    path
  end

  def date
    object.date.in_time_zone("America/Los_Angeles").strftime("%FT%T%:z")
  end

  def invoice
    object.journalable_type == "Invoice" ? object.journalable : nil
  end

  def journalable_path
    case object.journalable_type
    when "Invoice"
      "/#{object.journalable.invoiceable_type.tableize}/#{object.journalable.invoiceable.slug}/invoices/#{object.journalable.slug}/"
    when "Payment"
      "/#{object.journalable.payable_type.tableize}/#{object.journalable.payable.slug}/invoices/#{object.journalable.invoice.slug}/payments/#{object.journalable.id}"
    end
  end

  def payable_name
    case object.journalable_type
    when "Invoice"
      object.journalable.invoiceable.display_name
    when "Payment"
      object.journalable.payable.display_name
    end
  end

  def payable_type
    case object.journalable_type
    when "Invoice"
      object.journalable.invoiceable_type
    when "Payment"
      object.journalable.payable_type
    end
  end

  def payable_path
    case object.journalable_type
    when "Invoice"
      "/#{object.journalable.invoiceable_type.tableize}/#{object.journalable.invoiceable.slug}"
    when "Payment"
      "/#{object.journalable.payable_type.tableize}/#{object.journalable.payable.slug}"
    end
  end
end
