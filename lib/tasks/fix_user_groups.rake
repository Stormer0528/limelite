namespace :fix_user_groups do
  task process: :environment do 
    UserGroup.where(name: "Controller").each do |controller_group|
      controller_group.update module_permissions: {
        BankAccount: "Owner",
        Account: "Owner",
        CreditCard: "Owner",
        Customer: "Owner",
        Report: "Owner",
        BatchUpload: "Owner",
        Vendor: "Owner",
        approval_amount: 0
      }
    end

    UserGroup.where(name: "Admin").each do |admin_group|
      admin_group.update module_permissions: {
        BankAccount: "Owner",
        Account: "Owner",
        CreditCard: "Owner",
        Customer: "Owner",
        Report: "Owner",
        BatchUpload: "Owner",
        Vendor: "Owner",
        approval_amount: 0
      }
    end

    UserGroup.where(name: "Staff Accountant").each do |sa_group|
      sa_group.update module_permissions: {
        BankAccount: "Editor",
        Account: "Editor",
        CreditCard: "Editor",
        Customer: "Editor",
        Report: "Editor",
        BatchUpload: "Editor",
        Vendor: "Editor",
        approval_amount: 0
      }
    end

    UserGroup.where(name: "AP Clerk").each do |ap_clerk|
      ap_clerk.update module_permissions: {
        BankAccount: "Editor",
        Account: "Editor",
        CreditCard: "Editor",
        Customer: "Editor",
        Report: "Editor",
        BatchUpload: "Editor",
        Vendor: "Editor",
        approval_amount: 0
      }
    end

    UserGroup.where(name: "Other Editors").each do |other|
      other.update module_permissions: {
        BankAccount: "Editor",
        Account: "Editor",
        CreditCard: "Editor",
        Customer: "Editor",
        Report: "Editor",
        BatchUpload: "Editor",
        Vendor: "Editor",
        approval_amount: 0
      }
    end

    UserGroup.where(name: "Board").each do |board_group|
      board_group.update module_permissions: {
        BankAccount: "Viewer",
        Account: "Viewer",
        CreditCard: "Viewer",
        Customer: "Viewer",
        Report: "Viewer",
        BatchUpload: "Owner",
        Vendor: "Viewer",
        approval_amount: 0
      }
    end

    UserGroup.where(name: "Director").each do |director_group|
      director_group.update module_permissions: {
        BankAccount: "Viewer",
        Account: "Viewer",
        CreditCard: "Viewer",
        Customer: "Viewer",
        Report: "Viewer",
        BatchUpload: "Owner",
        Vendor: "Viewer",
        approval_amount: 0
      }
    end

    UserGroup.where(name: "Executive Assistant").each do |executive_assistant_group|
      executive_assistant_group.update module_permissions: {
        BankAccount: "Viewer",
        Account: "Viewer",
        CreditCard: "Viewer",
        Customer: "Viewer",
        Report: "Viewer",
        BatchUpload: "Editor",
        Vendor: "Viewer",
        approval_amount: 0
      }
    end

    UserGroup.where(name: "Viewers").each do |viewers_group|
      viewers_group.update module_permissions: {
        BankAccount: "Viewer",
        Account: "Viewer",
        CreditCard: "Viewer",
        Customer: "Viewer",
        Report: "Viewer",
        BatchUpload: "Viewer",
        Vendor: "Viewer",
        approval_amount: 0
      }
    end
  end
end
