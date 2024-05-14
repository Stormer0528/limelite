# == Schema Information
#
# Table name: report_comparative_profit_and_loss_statements
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
#  index_comparative_profit_loss_statements_on_organization_id  (organization_id)
#
# Foreign Keys
#
#  fk_rails_...  (organization_id => organizations.id)
#

FactoryBot.define do
  factory :report_comparative_profit_and_loss_statement, class: 'Report::ComparativeProfitAndLossStatement' do
    start_date { "2020-08-17" }
    end_date { "2020-08-17" }
    data { "" }
    organization { nil }
  end
end
