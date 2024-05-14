class AddModulePermissionsToUserGroups < ActiveRecord::Migration[5.2]
  def up
    change_table :user_groups do |t|
      t.jsonb :module_permissions, null: false, default: {
        BankAccount: "Viewer",
        Account: "Viewer",
        CreditCard: "Viewer",
        Customer: "Viewer",
        Report: "Viewer",
        BatchUpload: "Viewer",
        Vendor: "Viewer",
        approval_amount: 0
      }
      t.index :module_permissions, using: :gin
    end
  end

  def down
    remove_index :user_groups, :module_permissions
    remove_column :user_groups, :module_permissions
  end
end
