namespace :user_groups do
  task process: :environment do
    Organization.all.each do |org|
      # Create Admin Group
      admin_group = UserGroup.find_or_create_by organization: org, name: "Admin"
      # Assign Admin Users
      User.where(back_office: true).or(User.where(super_admin: true)).each do |user|
        UserGroupAssignment.find_or_create_by organization: org, user: user, user_group: admin_group
      end

      # Create Group Hierarchy
      controller_group = org.user_groups.create name: "Controller", parent: admin_group
      sa_group = org.user_groups.create name: "Staff Accountant", parent: controller_group
      ap_clerk = org.user_groups.create name: "AP Clerk", parent: sa_group
      board_group = org.user_groups.create name: "Board", parent: ap_clerk
      director_group = org.user_groups.create name: "Director", parent: board_group
      executive_assistant_group = org.user_groups.create name: "Executive Assistant", parent: director_group

      # Add Users
      org.editor_assignments.where(role: "Controller").map(&:user).each do |user|
        UserGroupAssignment.create organization: org, user: user, user_group: controller_group
      end
      org.editor_assignments.where(role: "AP Clerk").map(&:user).each do |user|
        UserGroupAssignment.create organization: org, user: user, user_group: ap_clerk
      end
      org.editor_assignments.where(role: "Staff Accountant").map(&:user).each do |user|
        UserGroupAssignment.create organization: org, user: user, user_group: sa_group
      end

      unless org.editor_assignments.where(role: "None").count > 0

        editor_group = org.user_groups.create name: "Other Editors", parent: ap_clerk
        org.editor_assignments.where(role: "None").map(&:user).each do |user|
          UserGroupAssignment.create organization: org, user: user, user_group: editor_group
        end

        viewer_group = org.user_groups.create name: "Viewers", parent: director_group
        org.viewers.each do |user|
          UserGroupAssignment.create organization: org, user: user, user_group: viewer_group
        end
      end

      controller_group.update module_permissions: {
        BankAccount: "Owner",
        Account: "Owner",
        CreditCard: "Owner",
        Customer: "Owner",
        Report: "Owner",
        BatchUpload: "Owner",
        Vendor: "Owner"
      }

      admin_group.update module_permissions: {
        BankAccount: "Owner",
        Account: "Owner",
        CreditCard: "Owner",
        Customer: "Owner",
        Report: "Owner",
        BatchUpload: "Owner",
        Vendor: "Owner"
      }

      sa_group.update module_permissions: {
        BankAccount: "Owner",
        Account: "Owner",
        CreditCard: "Owner",
        Customer: "Owner",
        Report: "Owner",
        BatchUpload: "Owner",
        Vendor: "Owner"
      }

      ap_clerk.update module_permissions: {
        BankAccount: "Owner",
        Account: "Owner",
        CreditCard: "Owner",
        Customer: "Owner",
        Report: "Owner",
        BatchUpload: "Owner",
        Vendor: "Owner"
      }

      board_group.update module_permissions: {
        BankAccount: "Editor",
        Account: "Editor",
        CreditCard: "Editor",
        Customer: "Editor",
        Report: "Editor",
        BatchUpload: "Editor",
        Vendor: "Editor"
      }

      director_group.update module_permissions: {
        BankAccount: "Editor",
        Account: "Editor",
        CreditCard: "Editor",
        Customer: "Editor",
        Report: "Editor",
        BatchUpload: "Editor",
        Vendor: "Editor"
      }

      executive_assistant_group.update module_permissions: {
        BankAccount: "Viewer",
        Account: "Viewer",
        CreditCard: "Viewer",
        Customer: "Viewer",
        Report: "Viewer",
        BatchUpload: "Editor",
        Vendor: "Viewer"
      }
    end
  end
end
