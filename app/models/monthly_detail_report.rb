# == Schema Information
#
# Table name: monthly_detail_reports
#
#  id                  :bigint(8)        not null, primary key
#  start_date          :date
#  end_date            :date
#  name                :string
#  subtitle            :string
#  accounting_method   :string           default("Cash")
#  display_columns_by  :string           default("Total")
#  show_active_columns :boolean          default(TRUE)
#  show_active_rows    :boolean          default(TRUE)
#  data                :jsonb
#  organization_id     :bigint(8)
#  status              :string           default("New")
#  notes               :text
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#  slug                :string
#
# Indexes
#
#  index_monthly_detail_reports_on_organization_id           (organization_id)
#  index_monthly_detail_reports_on_slug                      (slug)
#  index_monthly_detail_reports_on_slug_and_organization_id  (slug,organization_id) UNIQUE
#

class MonthlyDetailReport < ApplicationRecord
  extend FriendlyId
  friendly_id :slug_candidates, use: :scoped, scope: :organization
end
