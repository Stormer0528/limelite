# == Schema Information
#
# Table name: organization_assignments
#
#  id              :integer          not null, primary key
#  user_id         :integer
#  organization_id :integer
#  type            :string
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  role            :string           default("None"), not null
#  permissions     :jsonb            not null
#
# Indexes
#
#  index_organization_assignments_on_organization_id              (organization_id)
#  index_organization_assignments_on_organization_id_and_user_id  (organization_id,user_id)
#  index_organization_assignments_on_permissions                  (permissions) USING gin
#  index_organization_assignments_on_user_id                      (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (organization_id => organizations.id)
#  fk_rails_...  (user_id => users.id)
#

require 'rails_helper'

RSpec.describe OrganizationAssignment, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
