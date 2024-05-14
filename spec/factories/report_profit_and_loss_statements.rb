# == Schema Information
#
# Table name: report_profit_and_loss_statements
#
#  id              :bigint(8)        not null, primary key
#  start_date      :date
#  end_date        :date
#  data            :jsonb
#  organization_id :bigint(8)
#  account_fund_id :bigint(8)
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#
# Indexes
#
#  index_report_profit_and_loss_statements_on_account_fund_id  (account_fund_id)
#  index_report_profit_and_loss_statements_on_organization_id  (organization_id)
#
# Foreign Keys
#
#  fk_rails_...  (account_fund_id => account_funds.id)
#  fk_rails_...  (organization_id => organizations.id)
#

FactoryBot.define do
  factory :profit_and_loss_statement, class: 'Report::ProfitAndLossStatement' do
    association :organization, factory: :organization

    start_date {Faker::Date.backward(days: 90)}
    end_date {Faker::Date.forward(days: 30)}
  end
end
