# == Schema Information
#
# Table name: vendors
#
#  id                        :integer          not null, primary key
#  company                   :string
#  notes                     :text
#  email                     :string
#  other                     :string
#  website                   :string
#  account_number            :string
#  active                    :boolean
#  payment_terms             :text
#  global                    :boolean
#  rating                    :integer
#  created_at                :datetime         not null
#  updated_at                :datetime         not null
#  title                     :string
#  first_name                :string
#  middle_name               :string
#  last_name                 :string
#  primary_phone             :string
#  suffix                    :string
#  organization_id           :integer
#  slug                      :string
#  logo_url                  :string
#  aasm_state                :string
#  file_url                  :string
#  start_date                :date
#  end_date                  :date
#  starting_balance_in_cents :integer          default(0), not null
#  starting_balance_currency :string           default("USD"), not null
#  creator_id                :bigint(8)
#
# Indexes
#
#  index_vendors_on_aasm_state                (aasm_state)
#  index_vendors_on_creator_id                (creator_id)
#  index_vendors_on_name                      (company,title,first_name,last_name,suffix)
#  index_vendors_on_organization_id           (organization_id)
#  index_vendors_on_slug                      (slug)
#  index_vendors_on_slug_and_organization_id  (slug,organization_id) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (creator_id => users.id)
#  fk_rails_...  (organization_id => organizations.id)
#

class Vendor < ApplicationRecord
  extend FriendlyId
  include AASM
  include Payable
  include Invoiceable
  include Loggable
  include Authable
  include Approvable
  include FileUploadable
  include ActiveModel::Validations

  friendly_id :slug_candidates, use: :scoped, scope: :organization

  TYPES = ["Rents", "Royalties", "Other Income", "Federal Income Tax Withheld", "Fishing Boat Proceeds",
           "Medical and Health Care Payments", "Non Employee Compensation", "Substitute Pauments in Lieu of Interest", "Payer made direct sales of $5000 or more consumer products to a buyer (recipient) for resale", "Crop Insurance Proceeds", "Excess Golden Parachute Payments", "Gross Proceeds Paid to an attorney"].freeze

  # Money
  #-----------------------------------------------------------------------------
  monetize :starting_balance_in_cents

  # RELATIONSHIPS
  #-----------------------------------------------------------------------------
  validates_associated :ten_ninety_nines, :addresses
  belongs_to :organization
  belongs_to :creator, class_name: "User", optional: true

  # Addresses
  has_many :addresses, as: :addressable, dependent: :destroy
  accepts_nested_attributes_for :addresses, allow_destroy: true

  # ten_ninety_nines
  has_many :ten_ninety_nines, -> { order(year: :desc) }, dependent: :destroy
  accepts_nested_attributes_for :ten_ninety_nines, allow_destroy: true

  # Phones
  has_one :home_phone, as: :phoneable, dependent: :destroy,
                       class_name: "Phone::Home"
  accepts_nested_attributes_for :home_phone, allow_destroy: true
  delegate :number, to: :home_phone, prefix: true, allow_nil: true

  has_one :mobile_phone, as: :phoneable, dependent: :destroy,
                         class_name: "Phone::Mobile"
  accepts_nested_attributes_for :mobile_phone, allow_destroy: true
  delegate :number, to: :mobile_phone, prefix: true, allow_nil: true

  has_one :work_phone, as: :phoneable, dependent: :destroy,
                       class_name: "Phone::Work"
  accepts_nested_attributes_for :work_phone, allow_destroy: true
  delegate :number, to: :work_phone, prefix: true, allow_nil: true

  has_one :fax_phone, as: :phoneable, dependent: :destroy,
                      class_name: "Phone::Fax"
  accepts_nested_attributes_for :fax_phone, allow_destroy: true
  delegate :number, to: :fax_phone, prefix: true, allow_nil: true

  # NOTE: disabling, currently throwing error
  # has_many :checks, class_name: "BankAccount::Check"
  has_many :purchase_orders

  # Entry Items
  has_many :entry_items, as: :payable

  # File Uploads
  has_many :file_uploads, as: :uploadable, class_name: "FileUpload"

  # Scopes
  #---------------------------------------------------------------------------
  scope :by_partial_name, ->(name) {
                            where("(CONCAT(vendors.title, vendors.first_name, vendors.last_name, vendors.suffix) ILIKE ?) OR vendors.company ILIKE ?", "%#{name}%", "%#{name}%")
                          }
  scope :by_partial_number, ->(number) { where(Arel.sql("vendors.account_number ILIKE ?", "%#{number}%")) }
  scope :order_by_name, -> {
                          order(Arel.sql("COALESCE(NULLIF(company,''),COALESCE(NULLIF(title,''),NULLIF(first_name,''),NULLIF(last_name,''),NULLIF(suffix,'')))"))
                        }

  # Pundit Policy
  #---------------------------------------------------------------------------
  def self.policy_class
    VendorPolicy
  end

  # Instance Methods
  #-----------------------------------------------------------------------------
  def name
    company.blank? ? full_name : company
  end

  def full_name
    [title, first_name, middle_name, last_name, suffix].compact.join " "
  end

  # NOTE: start date must be before end date
  def invoice_due_during(start_date, end_date)
    invoices.where(due_date: start_date..end_date)
  end

  def invoice_amount_due_during(start_date, end_date)
    invoices.where(due_date: start_date..end_date).map(&:amount_remaining).inject(0, &:+)
  end

  def slug_candidates
    [
      :company,
      [:first_name, :last_name]
    ]
  end

  def current_ten_ninety_nine(year=Date.today.year)
    ten_ninety_nines.where("year <= ?", year.to_i).order(year: :desc).first
  end

  def visible_id
    id.to_s.rjust(6, "0")
  end

  def display_name
    [name, visible_id].join(" - ")
  end
end
