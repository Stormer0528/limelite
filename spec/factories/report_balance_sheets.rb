# == Schema Information
#
# Table name: report_balance_sheets
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
#  index_report_balance_sheets_on_organization_id  (organization_id)
#
# Foreign Keys
#
#  fk_rails_...  (organization_id => organizations.id)
#

FactoryBot.define do
  factory :report_balance_sheet, class: 'Report::BalanceSheet' do
    # start_date "2018-08-10"
    # end_date "2018-08-10"
    # name "MyString"
    # subtitle "MyString"
    # data ""
    # organization nil
    # status "MyString"
    # notes "MyText"
    # slug "MyString"
  end
end
