# == Schema Information
#
# Table name: credit_card_items
#
#  id              :bigint(8)        not null, primary key
#  date            :date
#  memo            :string
#  file_url        :string
#  type            :string
#  entry_id        :bigint(8)
#  amount_in_cents :integer          default(0), not null
#  amount_currency :string           default("USD"), not null
#  credit_card_id  :bigint(8)
#  aasm_state      :string           default("draft")
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  creator_id      :bigint(8)
#  number          :string
#
# Indexes
#
#  index_credit_card_items_on_aasm_state      (aasm_state)
#  index_credit_card_items_on_creator_id      (creator_id)
#  index_credit_card_items_on_credit_card_id  (credit_card_id)
#  index_credit_card_items_on_date            (date)
#  index_credit_card_items_on_entry_id        (entry_id)
#  index_credit_card_items_on_type            (type)
#
# Foreign Keys
#
#  fk_rails_...  (creator_id => users.id)
#  fk_rails_...  (credit_card_id => credit_cards.id)
#  fk_rails_...  (entry_id => entries.id)
#

FactoryBot.define do
  factory :credit_card_item, class: 'CreditCard::Item' do
    # date { Faker::Date.between(12.months.ago, 2.months.ago) }
    # memo { Faker::Educator.university }
    # entry { nil }
    # amount { Faker::Number.decimal(2) }
    # credit_card { nil }
    # aasm_state { "draft" }
    # account { nil }
    # vendor { nil }
  end
end
