# == Schema Information
#
# Table name: cash_flow_reports
#
#  id                  :bigint(8)        not null, primary key
#  start_date          :date
#  end_date            :date
#  name                :string
#  subtitle            :string
#  display_columns_by  :string           default("Total")
#  show_active_columns :boolean          default(TRUE)
#  show_active_rows    :boolean          default(TRUE)
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
#  index_cash_flow_reports_on_organization_id           (organization_id)
#  index_cash_flow_reports_on_slug                      (slug)
#  index_cash_flow_reports_on_slug_and_organization_id  (slug,organization_id) UNIQUE
#

FactoryBot.define do
  factory :cash_flow_report do
    # start_date ""
    # end_date ""
    # name "MyString"
    # data ""
  end
end
