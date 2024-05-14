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

FactoryBot.define do
  factory :payment do
    # vendor { build_stubbed(:vendor) }
    # invoice { build_stubbed(:invoice) }
    # purchase_order { build_stubbed(:purchase_order) }
    # final_pay { [false, true].sample }
    # amount { Faker::Number.decimal(2) }
    # date { Faker::Date.between(8.months.ago, 2.days.ago) }
    # tax_amount { Faker::Number.decimal(2) }
    # shipping_amount { Faker::Number.decimal(2) }
  end
end
