class CreateUserGroupsForOrganizations < ActiveRecord::Migration[5.2]
  def up
    Organization.all.each do |org|
      group = org.user_groups.create name: "Admin"
      User.where(super_admin: true).or(User.where(back_office: true)).each do |user|
        UserGroupAssignment.create user: user, user_group: group, organization: org
      end
    end
  end

  def down; end
end
