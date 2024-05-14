# == Schema Information
#
# Table name: ap_aging_reports
#
#  id                  :bigint(8)        not null, primary key
#  start_date          :date
#  end_date            :date
#  name                :string
#  subtitle            :string
#  aging_method        :string           default("CURRENT")
#  days_per_period     :integer          default(30)
#  show_active_columns :boolean          default(TRUE)
#  show_active_rows    :boolean          default(TRUE)
#  periods             :integer          default(3)
#  data                :json
#  organization_id     :bigint(8)
#  status              :string           default("New")
#  notes               :text
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#  slug                :string
#
# Indexes
#
#  index_ap_aging_reports_on_organization_id           (organization_id)
#  index_ap_aging_reports_on_slug                      (slug)
#  index_ap_aging_reports_on_slug_and_organization_id  (slug,organization_id) UNIQUE
#

FactoryBot.define do
  factory :ap_aging_report do
  end
end
