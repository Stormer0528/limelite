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

require 'rails_helper'
require "models/concerns/report_base_spec"

RSpec.describe Report::BalanceSheet, type: :model do
  include_examples "report_base"
  pending "add some examples to (or delete) #{__FILE__}"
end
