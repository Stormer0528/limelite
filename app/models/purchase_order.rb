# == Schema Information
#
# Table name: purchase_orders
#
#  id                       :integer          not null, primary key
#  vendor_id                :integer
#  number                   :string
#  date_needed              :date
#  buyer                    :string
#  requisition_number       :string
#  created_at               :datetime         not null
#  updated_at               :datetime         not null
#  invoice_id               :integer
#  slug                     :string
#  file_url                 :string
#  aasm_state               :string
#  quote_date               :date
#  proposal_date            :date
#  quote_number             :string
#  proposal_number          :string
#  reference_number         :string
#  payment_terms            :text
#  address_id               :bigint(8)
#  vendor_address_id        :bigint(8)
#  tax_amount_in_cents      :integer          default(0), not null
#  tax_amount_currency      :string           default("USD"), not null
#  shipping_amount_in_cents :integer          default(0), not null
#  shipping_amount_currency :string           default("USD"), not null
#  creator_id               :bigint(8)
#  date                     :date
#  organization_id          :bigint(8)
#  requested_by_id          :bigint(8)
#  requested_for_id         :bigint(8)
#
# Indexes
#
#  index_purchase_orders_on_address_id                (address_id)
#  index_purchase_orders_on_creator_id                (creator_id)
#  index_purchase_orders_on_invoice_id                (invoice_id)
#  index_purchase_orders_on_invoice_id_and_vendor_id  (invoice_id,vendor_id)
#  index_purchase_orders_on_number_and_vendor_id      (number,vendor_id) UNIQUE
#  index_purchase_orders_on_organization_id           (organization_id)
#  index_purchase_orders_on_requested_by_id           (requested_by_id)
#  index_purchase_orders_on_requested_for_id          (requested_for_id)
#  index_purchase_orders_on_slug                      (slug)
#  index_purchase_orders_on_slug_and_vendor_id        (slug,vendor_id) UNIQUE
#  index_purchase_orders_on_vendor_address_id         (vendor_address_id)
#  index_purchase_orders_on_vendor_id                 (vendor_id)
#
# Foreign Keys
#
#  fk_rails_...  (address_id => addresses.id)
#  fk_rails_...  (creator_id => users.id)
#  fk_rails_...  (invoice_id => invoices.id)
#  fk_rails_...  (organization_id => organizations.id)
#  fk_rails_...  (requested_by_id => users.id)
#  fk_rails_...  (requested_for_id => users.id)
#  fk_rails_...  (vendor_address_id => addresses.id)
#  fk_rails_...  (vendor_id => vendors.id)
#

class PurchaseOrder < ApplicationRecord
  extend FriendlyId
  include AASM
  include FileUploadable
  include Loggable
  include Authable
  include Approvable

  friendly_id :slug_candidates, use: :scoped, scope: [:vendor]

  monetize :tax_amount_in_cents
  monetize :shipping_amount_in_cents

  # RELATIONSHIPS
  #-----------------------------------------------------------------------------
  belongs_to :organization
  belongs_to :creator, class_name: "User", validate: false

  belongs_to :vendor
  delegate :name, :ein, to: :vendor, prefix: true, allow_nil: true

  belongs_to :invoice, optional: true, autosave: false
  delegate  :number, :date, :due_date, :amount, :description,
            :amount_remaining,
            to: :invoice, prefix: true, allow_nil: true

  has_many :payments, through: :invoice

  has_many :purchase_order_items, dependent: :destroy
  accepts_nested_attributes_for :purchase_order_items, allow_destroy: true

  belongs_to :address, optional: true
  belongs_to :vendor_address, class_name: "Address", optional: true

  belongs_to :requested_by, class_name: "User", optional: true
  belongs_to :requested_for, class_name: "User", optional: true

  # SCOPES
  #-----------------------------------------------------------------------------
  scope :by_partial_number, ->(number) { where("purchase_orders.number ILIKE ?", "%#{number}%") }
  scope :by_partial_invoice_number, ->(number) { joins(:invoice).where("invoices.number ILIKE ?", "%#{number}%") }

  scope :dated_before,    ->(before_date) { where("purchase_orders.date <= ?", before_date) }
  scope :dated_after,     ->(after_date)  { where("purchase_orders.date >= ?", after_date) }
  scope :needed_before,   ->(before_date) { where("purchase_orders.date_needed <= ?", before_date) }
  scope :needed_after,    ->(after_date)  { where("purchase_orders.date_needed >= ?", after_date) }
  scope :with_invoice,    -> { where.not invoice_id: nil }
  scope :without_invoice, -> { where(invoice_id: nil) }

  # Pundit Policy
  #---------------------------------------------------------------------------
  def self.policy_class
    PurchaseOrderPolicy
  end

  # VALIDATIONS
  #-----------------------------------------------------------------------------
  validates :number, presence: true
  validate :total_matches_invoice_amount

  def total_matches_invoice_amount
    errors.add(:total, "does not match Purchase Order") if invoice && aasm_state != "draft" && (total != invoice.amount)
  end

  # INSTANCE METHODS
  #-----------------------------------------------------------------------------
  def subtotal
    purchase_order_items
      .reject(&:marked_for_destruction?) # ignore items about to be deleted
      .inject(Money.new(0)) {|total, item| item.total + total }
  end

  def total
    subtotal + shipping_amount + tax_amount
  end

  def slug_candidates
    [
      :number,
      [:number, :date],
      :date
    ]
  end
end
