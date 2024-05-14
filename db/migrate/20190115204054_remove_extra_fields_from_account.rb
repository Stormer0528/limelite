class RemoveExtraFieldsFromAccount < ActiveRecord::Migration[5.1]
  def up
    remove_column :accounts, :owner
    remove_column :accounts, :description
    remove_column :accounts, :state_account_number
    remove_column :accounts, :pseudo
  end

  def down
    add_column :accounts, :owner, :string
    add_column :accounts, :description, :string
    add_column :accounts, :state_account_number, :string
    add_column :accounts, :pseudo, :string
  end
end
