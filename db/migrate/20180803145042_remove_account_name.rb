class RemoveAccountName < ActiveRecord::Migration[5.1]
  def up
    remove_column :accounts, :name
  end

  def down
    add_column :accounts, :name, :string
  end
end
