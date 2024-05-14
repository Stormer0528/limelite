# == Schema Information
#
# Table name: entries
#
#  id               :integer          not null, primary key
#  organization_id  :integer
#  creator_id       :integer
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  date             :date
#  entry_type       :string           default("Transaction")
#  journalable_type :string
#  journalable_id   :bigint(8)
#  aasm_state       :string
#  backup_file_url  :string
#  file_url         :string
#
# Indexes
#
#  index_entries_on_aasm_state                           (aasm_state)
#  index_entries_on_creator_id                           (creator_id)
#  index_entries_on_date                                 (date)
#  index_entries_on_entry_type                           (entry_type)
#  index_entries_on_journalable_type_and_journalable_id  (journalable_type,journalable_id)
#  index_entries_on_organization_id                      (organization_id)
#
# Foreign Keys
#
#  fk_rails_...  (creator_id => users.id)
#  fk_rails_...  (organization_id => organizations.id)
#

FactoryBot.define do
  factory :entry do
    association :organization, factory: :organization
    association :creator,      factory: :user

    entry_type { Entry::TYPES.sample }
    date { Faker::Date.between(from: 6.months.ago, to: Date.today) }

    factory :entry_with_items do
      transient do
        amount_in_cents { 500_000 }
        payable { nil }
      end

      after(:build) do |entry, evaluator|
        fund = build(:account_fund, organization: entry.organization)
        resource = build(:account_resource, organization: entry.organization)

        # build items
        entry.entry_items << build(
          :ei_credit,
          amount_in_cents: evaluator.amount_in_cents,
          account: build(:account, account_fund: fund, account_resource: resource, organization: entry.organization),
          payable: evaluator.payable
        )

        entry.entry_items << build(
          :ei_debit,
          amount_in_cents: -evaluator.amount_in_cents,
          account: build(:account, account_fund: fund, account_resource: resource, organization: entry.organization),
          payable: evaluator.payable
        )
      end
    end
  end
end
