# == Schema Information
#
# Table name: user_groups
#
#  id                 :bigint(8)        not null, primary key
#  name               :string
#  parent_id          :bigint(8)
#  organization_id    :bigint(8)
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#  module_permissions :jsonb            not null
#
# Indexes
#
#  index_user_groups_on_module_permissions  (module_permissions) USING gin
#  index_user_groups_on_organization_id     (organization_id)
#  index_user_groups_on_parent_id           (parent_id)
#
# Foreign Keys
#
#  fk_rails_...  (organization_id => organizations.id)
#  fk_rails_...  (parent_id => user_groups.id)
#
require "rails_helper"

RSpec.describe UserGroup, type: :model, focus: true, user_permissions: true do
  context "Factories:" do
    it "has a valid factory" do
      expect(build_stubbed(:user_group)).to be_valid
    end
  end

  context "Relationships:" do
    it { should belong_to(:parent).class_name("UserGroup") }

    it { should have_many(:children).class_name("UserGroup").with_foreign_key("parent_id") }
    it { should have_many(:user_group_assignments) }
    it { should have_many(:users).through(:user_group_assignments) }

    it "should be able to create a parent" do
      parent = UserGroup.create name: "ParentGroup"
      child  = UserGroup.create name: "ChildGroup", parent_id: parent.id

      expect(child.parent&.name).to eq("ParentGroup")
      expect(parent.children).to include(child)
    end
  end
end
