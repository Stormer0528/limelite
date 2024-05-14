# == Schema Information
#
# Table name: report_balance_sheet_by_months
#
#  id              :bigint(8)        not null, primary key
#  start_date      :date             default(Sat, 26 Oct 2019)
#  end_date        :date             default(Sun, 25 Oct 2020)
#  data            :json
#  organization_id :bigint(8)
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#
# Indexes
#
#  index_report_balance_sheet_by_months_on_organization_id  (organization_id)
#
# Foreign Keys
#
#  fk_rails_...  (organization_id => organizations.id)
#
FactoryBot.define do
  factory :report_balance_sheet_by_month, class: 'Report::BalanceSheetByMonth' do
    start_date { "2020-08-17" }
    end_date { "2020-08-17" }
    data { "" }
    organization { nil }
  end
end
