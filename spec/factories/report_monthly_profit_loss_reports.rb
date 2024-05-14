# == Schema Information
#
# Table name: report_monthly_profit_loss_reports
#
#  id              :bigint(8)        not null, primary key
#  start_date      :date
#  end_date        :date
#  name            :string
#  subtitle        :string
#  data            :json
#  organization_id :bigint(8)
#  account_fund_id :bigint(8)
#  notes           :text
#  slug            :string
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#
# Indexes
#
#  index_report_monthly_profit_loss_reports_on_account_fund_id  (account_fund_id)
#  index_report_monthly_profit_loss_reports_on_organization_id  (organization_id)
#
# Foreign Keys
#
#  fk_rails_...  (account_fund_id => account_funds.id)
#  fk_rails_...  (organization_id => organizations.id)
#

FactoryBot.define do
  factory :report_monthly_profit_loss_report, class: 'Report::MonthlyProfitLossReport' do
    # start_date { "2018-11-18" }
    # end_date { "2018-11-18" }
    # name { "MyString" }
    # subtitle { "MyString" }
    # data { "" }
    # organization { nil }
    # notes { "MyText" }
    # slug { "MyString" }
  end
end
