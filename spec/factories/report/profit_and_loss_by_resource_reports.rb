# == Schema Information
#
# Table name: profit_and_loss_by_resource
#
#  id              :bigint(8)        not null, primary key
#  start_date      :date
#  end_date        :date
#  data            :jsonb
#  organization_id :bigint(8)
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#
# Indexes
#
#  index_profit_and_loss_by_resource_on_organization_id  (organization_id)
#
# Foreign Keys
#
#  fk_rails_...  (organization_id => organizations.id)
#

FactoryBot.define do
  factory :report_profit_and_loss_by_resource_report, class: 'Report::ProfitAndLossByResourceReport' do
    association :organization, factory: :organization

    start_date {Faker::Date.backward(days: 90)}
    end_date {Faker::Date.forward(days: 30)}
  end
end
