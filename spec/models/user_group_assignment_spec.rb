# == Schema Information
#
# Table name: user_group_assignments
#
#  id              :bigint(8)        not null, primary key
#  user_group_id   :bigint(8)
#  user_id         :bigint(8)
#  organization_id :bigint(8)
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#
# Indexes
#
#  index_user_group_assignments_on_organization_id  (organization_id)
#  index_user_group_assignments_on_user_group_id    (user_group_id)
#  index_user_group_assignments_on_user_id          (user_id)
#  org_user_group_assignments                       (organization_id,user_id,user_group_id)
#
# Foreign Keys
#
#  fk_rails_...  (organization_id => organizations.id)
#  fk_rails_...  (user_group_id => user_groups.id)
#  fk_rails_...  (user_id => users.id)
#
require "rails_helper"

RSpec.describe UserGroupAssignment, type: :model, focus: true, user_permissions: true do
  context "Relationships:" do
    it { should belong_to(:user_group) }
    it { should belong_to(:user) }
    it { should belong_to(:organization) }
  end
end
