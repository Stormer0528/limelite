# == Schema Information
#
# Table name: invoices
#
#  id                :integer          not null, primary key
#  number            :string
#  date              :date
#  description       :text
#  notes             :text
#  due_date          :date
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  slug              :string
#  invoiceable_type  :string
#  invoiceable_id    :bigint(8)
#  account_object_id :bigint(8)
#  address_id      :bigint(8)
#  file_url          :string
#  aasm_state        :string
#  organization_id   :bigint(8)
#  paid              :boolean          default(FALSE)
#  final_payment_url :string
#  creator_id        :bigint(8)
#
# Indexes
#
#  index_invoices_on_aasm_state                           (aasm_state)
#  index_invoices_on_creator_id                           (creator_id)
#  index_invoices_on_date                                 (date)
#  index_invoices_on_due_date                             (due_date)
#  index_invoices_on_invoiceable_type_and_invoiceable_id  (invoiceable_type,invoiceable_id)
#  index_invoices_on_number                               (number)
#  index_invoices_on_number_and_invoiceable               (number,invoiceable_type,invoiceable_id) UNIQUE WHERE ((aasm_state)::text <> 'voided'::text)
#  index_invoices_on_organization_id                      (organization_id)
#  index_invoices_on_slug                                 (slug)
#  index_invoices_on_slug_invoiceable                     (slug,invoiceable_type,invoiceable_id) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (creator_id => users.id)
#  fk_rails_...  (organization_id => organizations.id)
#

class Invoice < ApplicationRecord
  extend FriendlyId
  include AASM
  include FileUploadable
  include Loggable
  include Authable
  include ApprovableWithEntry

  friendly_id :number, use: :scoped, scope: [:invoiceable_type, :invoiceable_id]

  # CALLBACKS
  #-----------------------------------------------------------------------------
  after_save :set_paid

  # RELATIONSHIPS
  #-----------------------------------------------------------------------------
  belongs_to :organization
  belongs_to :invoiceable, polymorphic: true
  belongs_to :creator, class_name: "User", optional: true
  belongs_to :address, class_name: "Address", optional: true
  belongs_to :account_object, class_name: "AccountObject", optional: true

  delegate :name, :ein, to: :invoiceable, prefix: true, allow_nil: true

  has_one :purchase_order

  has_many :payments, dependent: :destroy
  accepts_nested_attributes_for :payments, allow_destroy: true

  has_many :checks, -> { distinct }, through: :payments

  has_one :entry, as: :journalable, dependent: :destroy
  accepts_nested_attributes_for :entry, allow_destroy: true
  delegate :entry_items, :entry_type, to: :entry, allow_nil: true

  # SCOPES
  #-----------------------------------------------------------------------------
  scope :paid,      -> { where(paid: true) }
  scope :unpaid,    -> { where.not(paid: true) }
  scope :unvoided,   -> { where.not(aasm_state: 'voided') }
  scope :for_batch, -> {
                      joins(:entry).left_outer_joins(:payments).where(
                        aasm_state: "approved", payments: {id: nil}
                      ).order(due_date: :desc)
                    }
  scope :dated_before,      ->(before_date) { where("invoices.date <= ?", before_date) }
  scope :dated_after,       ->(after_date)  { where("invoices.date >= ?", after_date) }
  scope :due_before,        ->(before_date) { where("invoices.due_date <= ?", before_date) }
  scope :due_after,         ->(after_date)  { where("invoices.due_date >= ?", after_date) }
  scope :unpaid_before,     ->(before_date) {
    left_joins(:payments, payments: :bank_account_item)
      .where("bank_account_items.date > ? OR payments.id IS NULL", before_date)
      .distinct(:id)
  }
  scope :by_partial_number,      ->(number) { where("invoices.number ILIKE ?", "%#{number}%") }
  scope :with_purchase_order,    -> { joins(:purchase_order) }
  scope :without_purchase_order, -> {
    ids = joins(:purchase_order).pluck(:id)
    where.not(id: ids)
  }

  # VALIDATIONS
  #-----------------------------------------------------------------------------
  validates :number, presence: true
  validates_uniqueness_of :number, scope: :invoiceable,
                                   unless: proc {|invoice| invoice.aasm_state == "voided" }
  validate :vendor_must_assign_payable
  validate :vendor_must_credit_ap_code
  # validate :customer_must_assign_payable
  # validate :customer_must_debit_ar_code
  validate :total_amount_matches_purchase_order

  def vendor_must_assign_payable
    return if customer
    return unless entry

    errors.add(:entry, "all items must match the Vendor.") unless entry_items.map(&:payable).all? {|p| p == vendor }
  end

  def vendor_must_credit_ap_code
    return if customer
    return unless entry

    items = entry.entry_items.select {|item| item.type == "Credit" }

    errors.add(:entry, "must credit the AP Code 9500") unless items.map(&:account_object_code).include?("9500")
  end

  def customer_must_assign_payable
    return if vendor
    return unless entry

    errors.add(:entry, "all items must match the Customer.") unless entry_items.map(&:payable).all? {|p|
                                                                      p == customer
                                                                    }
  end

  def customer_must_debit_ar_code
    return if vendor
    return unless entry

    items = entry.entry_items.select {|item| item.type == "Debit" }

    errors.add(:entry, "must debit the AR Code 9200") unless items.map(&:account_object_code).include?("9200")
  end

  def total_amount_matches_purchase_order
    if purchase_order && aasm_state != "draft" && (amount != purchase_order.total)
      errors.add(:amount, "does not match Purchase Order")
    end
  end

  # Pundit Policy
  #---------------------------------------------------------------------------
  def self.policy_class
    InvoicePolicy
  end

  # Instance Methods
  #-----------------------------------------------------------------------------
  def vendor
    return nil unless invoiceable&.is_a?(Vendor)

    invoiceable
  end

  def customer
    return nil unless invoiceable&.is_a?(Customer)

    invoiceable
  end

  def display_label
    [date, " - ", number, description].join(" ")
  end

  # Amount
  def amount_paid
    payments.inject(Money.new(0)) {|total, payment| payment.amount + total }
  end

  def amount
    entry ? entry.amount : Money.new(0)
  end

  def amount_in_cents
    entry ? entry.amount_in_cents : 0
  end

  def amount_remaining
    amount - amount_paid
  end

  def is_paid?
    entry ? amount_remaining.zero? : false
  end

  def due_date
    super || (date || Date.today) + 30.days
  end

  # State Machine
  #-----------------------------------------------------------------------------
  aasm whiny_transitions: false do
    state :needs_approval, :approved, :needs_revision, :voided

    event :void, after: proc {|*args| remove_entry(*args) } do
      transitions from: [:draft, :needs_approval, :needs_revision, :approved],
                  to: :voided
    end
  end

  # Overriding authable module
  def auth_finished?(args)
    return true unless current_auth

    group = UserGroup.find(args[:user_group_id])
    permission = group.module_permissions.dig(record_class)

    return false unless args[:admin] || ["Owner", "Editor"].include?(permission)

    auth = current_auth || authorizations.new
    auth_approve  user_id: args[:user_id],
                  user_group_id: args[:user_group_id],
                  reason: args[:reason]

    true
  end

  private

  # Unique AASM Method
  def remove_entry(*args)
    save
    entry&.destroy
    checks.each {|check| check.void(*args) }
  end

  def set_paid
    if !paid? && is_paid?
      update_column(:paid, true)
    elsif paid? && !is_paid?
      update_column(:paid, false)
    end
  end
end
