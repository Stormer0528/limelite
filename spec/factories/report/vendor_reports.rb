# == Schema Information
#
# Table name: report_vendor_reports
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
#  index_report_vendor_reports_on_organization_id  (organization_id)
#
# Foreign Keys
#
#  fk_rails_...  (organization_id => organizations.id)
#

FactoryBot.define do
  factory :vendor_report do
    start_date { "2019-12-03" }
    end_date { "2019-12-03" }
    name { "MyString" }
    subtitle { "MyString" }
    data { "" }
    organization { nil }
    notes { "MyText" }
    slug { "MyString" }
  end
end
