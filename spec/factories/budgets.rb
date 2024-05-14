# == Schema Information
#
# Table name: budgets
#
#  id              :bigint(8)        not null, primary key
#  fiscal_year     :integer
#  account_id      :bigint(8)
#  amount_in_cents :integer          default(0), not null
#  amount_currency :string           default("USD"), not null
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#
# Indexes
#
#  index_budgets_on_account_id  (account_id)
#
# Foreign Keys
#
#  fk_rails_...  (account_id => accounts.id)
#

FactoryBot.define do
  factory :budget do
    fiscalYear { 1 }
    account { nil }
    amount { "" }
  end
end
