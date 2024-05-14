# == Schema Information
#
# Table name: customers
#
#  id              :bigint(8)        not null, primary key
#  title           :string
#  first_name      :string
#  last_name       :string
#  middle_name     :string
#  suffix          :string
#  company         :string
#  email           :string
#  website         :string
#  notes           :text
#  organization_id :bigint(8)
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  slug            :string
#  logo_url        :string
#  aasm_state      :string
#  number          :string
#  creator_id      :bigint(8)
#
# Indexes
#
#  index_customers_on_aasm_state                (aasm_state)
#  index_customers_on_creator_id                (creator_id)
#  index_customers_on_organization_id           (organization_id)
#  index_customers_on_slug                      (slug)
#  index_customers_on_slug_and_organization_id  (slug,organization_id) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (creator_id => users.id)
#  fk_rails_...  (organization_id => organizations.id)
#

class Customer < ApplicationRecord
  extend FriendlyId
  include AASM
  include Payable
  include Invoiceable
  include Loggable
  include Authable
  include Approvable

  friendly_id :slug_candidates, use: :scoped, scope: :organization

  # RELATIONSHIPS
  #-----------------------------------------------------------------------------
  belongs_to :organization

  # Addresses
  has_many :addresses, as: :addressable, dependent: :destroy
  accepts_nested_attributes_for :addresses, allow_destroy: true

  # Phones
  has_one :home_phone, as: :phoneable, dependent: :destroy, class_name: "Phone::Home"
  accepts_nested_attributes_for :home_phone, allow_destroy: true
  delegate :number, to: :home_phone, prefix: true, allow_nil: true

  has_one :mobile_phone, as: :phoneable, dependent: :destroy, class_name: "Phone::Mobile"
  accepts_nested_attributes_for :mobile_phone, allow_destroy: true
  delegate :number, to: :mobile_phone, prefix: true, allow_nil: true

  has_one :work_phone, as: :phoneable, dependent: :destroy, class_name: "Phone::Work"
  accepts_nested_attributes_for :work_phone, allow_destroy: true
  delegate :number, to: :work_phone, prefix: true, allow_nil: true

  has_one :fax_phone, as: :phoneable, dependent: :destroy, class_name: "Phone::Fax"
  accepts_nested_attributes_for :fax_phone, allow_destroy: true
  delegate :number, to: :fax_phone, prefix: true, allow_nil: true

  belongs_to :creator, class_name: "User", optional: true

  # Scopes
  #---------------------------------------------------------------------------
  scope :by_partial_name, ->(name) {
                            where("(CONCAT(customers.title, customers.first_name, customers.last_name, customers.suffix) ILIKE ?) OR customers.company ILIKE ?", "%#{name}%", "%#{name}%")
                          }
  scope :by_partial_number, ->(number) { where("customers.number ILIKE ?", "%#{number}%") }
  scope :order_by_name, -> {
                          order("COALESCE(NULLIF(company,''),COALESCE(NULLIF(title,''),NULLIF(first_name,''),NULLIF(last_name,''),NULLIF(suffix,'')))")
                        }

  # Pundit Policy
  #---------------------------------------------------------------------------
  def self.policy_class
    CustomerPolicy
  end

  # Instance Methods
  #-----------------------------------------------------------------------------
  def name
    company.blank? ? full_name : company
  end

  def full_name
    [title, first_name, last_name, suffix].compact.join " "
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
      :name,
      :number,
      [:name, :company],
      [:company, :number]
    ]
  end

  def visible_id
    id.to_s.rjust(6, "0")
  end

  def display_name
    [name, visible_id].join(" - ")
  end
end
