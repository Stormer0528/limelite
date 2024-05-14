# == Schema Information
#
# Table name: report_vendor1099_reports
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
#  index_report_vendor1099_reports_on_organization_id  (organization_id)
#
# Foreign Keys
#
#  fk_rails_...  (organization_id => organizations.id)
#

FactoryBot.define do
  factory :report_vendor1099_report, class: 'Report::Vendor1099Report' do
    # start_date { "2019-01-15" }
    # end_date { "2019-01-15" }
    # name { "MyString" }
    # subtitle { "MyString" }
    # data { "" }
    # organization { nil }
    # notes { "MyText" }
    # slug { "MyString" }
  end
end
