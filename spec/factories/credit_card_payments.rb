# == Schema Information
#
# Table name: credit_card_payments
#
#  id              :bigint(8)        not null, primary key
#  credit_card_id  :bigint(8)
#  amount_in_cents :integer          default(0), not null
#  amount_currency :string           default("USD"), not null
#  date            :date
#  memo            :text
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  account_id      :bigint(8)
#  entry_id        :bigint(8)
#  aasm_state      :string
#
# Indexes
#
#  index_credit_card_payments_on_account_id      (account_id)
#  index_credit_card_payments_on_credit_card_id  (credit_card_id)
#  index_credit_card_payments_on_entry_id        (entry_id)
#
# Foreign Keys
#
#  fk_rails_...  (account_id => accounts.id)
#  fk_rails_...  (credit_card_id => credit_cards.id)
#  fk_rails_...  (entry_id => entries.id)
#

FactoryBot.define do
  factory :credit_card_payment, class: "CreditCard::Payment" do
    association :credit_card
    association :creator, factory: :user
    association :vendor
    association :entry

    date { Faker::Date.backward(days: 300) }
    memo { Faker::Commerce.product_name }
  end
end
