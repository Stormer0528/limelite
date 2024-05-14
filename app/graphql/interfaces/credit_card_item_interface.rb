module Interfaces::CreditCardItemInterface
  include Types::BaseInterface
  include Concerns::Permissable
  description "Common fields for Payment and Charge for Credit Card"

  field :id, ID, null: true
  field :creator_id, ID, null: true
  field :date, String, null: true
  field :memo, String, null: true
  field :file_url, String, null: true
  field :slug, String, null: true
  field :type, String, null: true
  field :entry_id, ID, null: true
  field :entry, Types::EntryType, null: true
  field :amount, String, null: true
  field :amount_in_cents, Integer, null: true
  field :amount_currency, String, null: true
  field :credit_card_id, ID, null: true
  field :aasm_state, String, null: true
  field :account_id, ID, null: true
  field :vendor_id, ID, null: true
  field :created_at, String, null: true
  field :updated_at, String, null: true
  field :credit, String, null: true
  field :debit, String, null: false
  field :reconciled, Boolean, null: false
  field :path, String, null: true
  field :edit_path, String, null: true
  field :payee, String, null: true

  field :memo, String, null: true
  field :number, String, null: true
  field :entry, Types::EntryType, null: true

  field :type, String, null: false

  def type
    object.type.sub("CreditCard::", "")
  end

  def amount
    object.amount.format
  end

  def credit
    object.type == "CreditCard::Payment" ? object.amount.format : ""
  end

  def debit
    object.type == "CreditCard::Charge" ? object.amount.format : ""
  end

  def reconciled
    object.reconciled?
  end

  def path
    "/credit_cards/#{object.credit_card.slug}/#{object.type.demodulize.parameterize.pluralize}/#{object.id}"
  end

  def edit_path
    "/#{path}/edit"
  end

  def self.resolve_type(object, _ctx)
    if object.is_a?(CreditCard::Charge)
      Types::CreditCardChargeType
    elsif object.is_a?(CreditCard::Payment)
      Types::CreditCardPaymentType
    end
  end
end
