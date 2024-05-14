# == Schema Information
#
# Table name: statements
#
#  id                         :bigint(8)        not null, primary key
#  organization_id            :bigint(8)
#  started_at                 :date
#  ended_at                   :date
#  created_at                 :datetime         not null
#  updated_at                 :datetime         not null
#  starting_balance_in_cents  :integer          default(0), not null
#  starting_balance_currency  :string           default("USD"), not null
#  ending_balance_in_cents    :integer          default(0), not null
#  ending_balance_currency    :string           default("USD"), not null
#  adjustment_amount_in_cents :integer          default(0), not null
#  adjustment_amount_currency :string           default("USD"), not null
#  adjustment_date            :date
#  creator_id                 :integer
#  file_url                   :string
#  statementable_type         :string
#  statementable_id           :bigint(8)
#  aasm_state                 :string
#
# Indexes
#
#  index_statements_on_aasm_state                               (aasm_state)
#  index_statements_on_creator_id                               (creator_id)
#  index_statements_on_organization_id                          (organization_id)
#  index_statements_on_statementable_type_and_statementable_id  (statementable_type,statementable_id)
#
# Foreign Keys
#
#  fk_rails_...  (creator_id => users.id)
#  fk_rails_...  (organization_id => organizations.id)
#

FactoryBot.define do
  factory :statement do
    # organization { build_stubbed(:organization) }
    # bank_account { build_stubbed(:bank_account) }
    #
    # started_at  { Faker::Date.between(31.days.ago, 29.days.ago) }
    # ended_at    { Faker::Date.between(2.days.ago, Date.today) }
  end
end
