# == Schema Information
#
# Table name: report_cash_flow_reports
#
#  id                  :bigint(8)        not null, primary key
#  start_date          :date
#  end_date            :date
#  display_columns_by  :string           default("Total")
#  show_active_columns :boolean          default(TRUE)
#  show_active_rows    :boolean          default(TRUE)
#  data                :jsonb
#  organization_id     :bigint(8)
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#
# Indexes
#
#  index_report_cash_flow_reports_on_organization_id  (organization_id)
#

require 'rails_helper'
require "models/concerns/report_base_spec"

RSpec.describe Report::CashFlowReport, type: :model do
  include_examples "report_base"
  pending "add some examples to (or delete) #{__FILE__}"
end
