# == Schema Information
#
# Table name: report_budget_vs_actual_reports
#
#  id              :bigint(8)        not null, primary key
#  start_date      :date
#  end_date        :date
#  data            :jsonb
#  organization_id :bigint(8)
#  account_fund_id :bigint(8)
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#
# Indexes
#
#  index_report_budget_vs_actual_reports_on_account_fund_id  (account_fund_id)
#  index_report_budget_vs_actual_reports_on_organization_id  (organization_id)
#
# Foreign Keys
#
#  fk_rails_...  (account_fund_id => account_funds.id)
#  fk_rails_...  (organization_id => organizations.id)
#

require 'rails_helper'
require "models/concerns/report_base_spec"

RSpec.describe Report::BudgetVsActualReport, type: :model do
  include_examples "report_base"
  pending "add some examples to (or delete) #{__FILE__}"
end
