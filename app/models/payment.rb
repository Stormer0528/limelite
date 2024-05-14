# == Schema Information
#
# Table name: payments
#
#  id                       :integer          not null, primary key
#  invoice_id               :integer
#  final_pay                :boolean
#  date                     :date
#  tax_amount_in_cents      :integer          default(0)
#  shipping_amount_in_cents :integer          default(0)
#  created_at               :datetime         not null
#  updated_at               :datetime         not null
#  payable_type             :string
#  payable_id               :bigint(8)
#  address_id               :bigint(8)
#  creator_id               :integer
#  bank_account_item_id     :bigint(8)
#  entry_item_id            :bigint(8)
#
# Indexes
#
#  index_payments_on_address_id                   (address_id)
#  index_payments_on_bank_account_item_id         (bank_account_item_id)
#  index_payments_on_creator_id                   (creator_id)
#  index_payments_on_entry_item_id                (entry_item_id)
#  index_payments_on_invoice_id                   (invoice_id)
#  index_payments_on_payable_type_and_payable_id  (payable_type,payable_id)
#
# Foreign Keys
#
#  fk_rails_...  (address_id => addresses.id)
#  fk_rails_...  (creator_id => users.id)
#  fk_rails_...  (invoice_id => invoices.id)
#

class Payment < ApplicationRecord
  include FileUploadable

  # CALLBACKS
  #-----------------------------------------------------------------------------
  after_commit :update_invoice_paid

  # RELATIONSHIPS
  #-----------------------------------------------------------------------------
  belongs_to :payable, polymorphic: true
  delegate :name, :ein, :account_number,
           to: :payable, prefix: true, allow_nil: true

  belongs_to :invoice
  delegate :number, :date, :due_date, :description,
           to: :invoice, prefix: true, allow_nil: true

  belongs_to :creator, class_name: "User", optional: true

  has_one :purchase_order, through: :invoice
  delegate  :number, :status, :requisition_number, :status,
            to: :purchase_order, prefix: true, allow_nil: true

  belongs_to :bank_account_item, class_name: "BankAccount::Item"
  belongs_to :check,
             optional: true,
             class_name: "BankAccount::Check",
             foreign_key: :bank_account_item_id
  accepts_nested_attributes_for :check, allow_destroy: true

  belongs_to :entry_item
  accepts_nested_attributes_for :entry_item

  has_one :entry, through: :entry_item

  belongs_to :address, optional: true

  # Validations
  #---------------------------------------------------------------------------
  # validate :vendor_payments_must_not_assign_debits
  # validate :customer_payments_must_not_assign_credits
  # validate :check_address_must_match

  def vendor_payments_must_not_assign_debits
    return if customer

    items = entry.entry_items.select {|item| item.type == "Debit" }

    errors.add(:payment, "may not add a Vendor to the AP Account.") unless items.map(&:payable).all?(&:nil?)
  end

  def customer_payments_must_not_assign_credits
    return if vendor

    items = entry.entry_items.select {|item| item.type == "Credit" }

    errors.add(:payment, "may not add a Customer to the AR Account.") unless items.map(&:payable).all?(&:nil?)
  end

  def check_address_must_match
    errors.add(:payment, "may not change this address.") unless address == check.address
  end

  # Pundit Policy
  #---------------------------------------------------------------------------
  def self.policy_class
    PaymentPolicy
  end

  # MONEY
  #-----------------------------------------------------------------------------
  monetize :shipping_amount_in_cents
  monetize :tax_amount_in_cents

  # INSTANCE METHODS
  #-----------------------------------------------------------------------------

  def vendor
    return nil unless payable&.is_a?(Vendor)

    payable
  end

  def customer
    return nil unless payable&.is_a?(Customer)

    payable
  end

  def entry_id
    entry&.id
  end

  def identifier
    [date.to_formatted_s(:std), " - ", invoice_number, payable_name].join(" ")
  end

  def amount
    return Money.new(0) unless entry_item

    entry_item.amount.abs
  end

  def amount_in_cents
    return 0 unless entry_item

    entry_item.amount_in_cents.abs
  end

  def total_amount
    [(amount || Money.new(0)), shipping_amount, tax_amount].sum
  end

  def update_invoice_paid
    invoice&.save
  end
end
