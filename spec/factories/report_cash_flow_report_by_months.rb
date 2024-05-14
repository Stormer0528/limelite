# == Schema Information
#
# Table name: report_cash_flow_report_by_months
#
#  id              :bigint(8)        not null, primary key
#  start_date      :date
#  end_date        :date
#  name            :string
#  subtitle        :string
#  data            :json             not null
#  organization_id :bigint(8)
#  notes           :text
#  slug            :string
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#
# Indexes
#
#  index_report_cash_flow_report_by_months_on_organization_id  (organization_id)
#
# Foreign Keys
#
#  fk_rails_...  (organization_id => organizations.id)
#

FactoryBot.define do
  factory :report_cash_flow_report_by_month, class: 'Report::CashFlowReportByMonth' do
    start_date { "2019-02-08" }
    end_date { "2019-02-08" }
    name { "MyString" }
    subtitle { "MyString" }
    data { "" }
    organization { nil }
    notes { "MyText" }
    slug { "MyString" }
  end
end
