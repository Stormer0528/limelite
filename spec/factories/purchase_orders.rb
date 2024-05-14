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

FactoryBot.define do
  factory :purchase_order do
    association :creator, factory: :user
    association :vendor, factory: :vendor
    association :address, factory: :address
    association :vendor_address, factory: :address

    number      { Faker::Company.swedish_organisation_number }
    date { Faker::Date.between(from: 2.days.ago, to: Date.today + 2.days) }
    date_needed { Faker::Date.between(from: 2.days.ago, to: Date.today + 200.days) }
    buyer       { Faker::Company.name }
    requisition_number { Faker::Company.swedish_organisation_number }
    requested_by  { Faker::Company.name }
    requested_for { Faker::Company.name }

    quote_date    { Faker::Date.between(from: 2.days.ago, to: Date.today + 200.days) }
    proposal_date { Faker::Date.between(from: 2.days.ago, to: Date.today + 200.days) }

    quote_number { Faker::Company.swedish_organisation_number }
    proposal_number { Faker::Company.swedish_organisation_number }
    reference_number { Faker::Company.swedish_organisation_number }

    payment_terms { Faker::Hipster.paragraph }

    tax_amount_in_cents { Faker::Number.between(from: 100, to: 10_000_000) }
    shipping_amount_in_cents { Faker::Number.between(from: 100, to: 10_000_000) }
  end
end
