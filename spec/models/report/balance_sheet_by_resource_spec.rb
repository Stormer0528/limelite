# == Schema Information
#
# Table name: report_balance_sheet_by_resources
#
#  id              :bigint(8)        not null, primary key
#  start_date      :date             default(Sat, 26 Oct 2019)
#  end_date        :date             default(Sun, 25 Oct 2020)
#  data            :json
#  organization_id :bigint(8)
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#
# Indexes
#
#  index_report_balance_sheet_by_resources_on_organization_id  (organization_id)
#
# Foreign Keys
#
#  fk_rails_...  (organization_id => organizations.id)
#
require 'rails_helper'
require "models/concerns/report_base_spec"

RSpec.describe Report::BalanceSheetByResource, type: :model do
  include_examples "report_base"
  pending "add some examples to (or delete) #{__FILE__}"
end
