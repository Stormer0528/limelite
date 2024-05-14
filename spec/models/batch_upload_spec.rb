# == Schema Information
#
# Table name: batch_uploads
#
#  id                :bigint(8)        not null, primary key
#  total_invoices    :integer
#  critical_invoices :integer
#  notes             :text
#  creator_id        :integer
#  aasm_state        :string
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  organization_id   :bigint(8)
#  data              :json
#
# Indexes
#
#  index_batch_uploads_on_aasm_state       (aasm_state)
#  index_batch_uploads_on_creator_id       (creator_id)
#  index_batch_uploads_on_organization_id  (organization_id)
#
# Foreign Keys
#
#  fk_rails_...  (creator_id => users.id)
#  fk_rails_...  (organization_id => organizations.id)
#

require 'rails_helper'

RSpec.describe BatchUpload, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
