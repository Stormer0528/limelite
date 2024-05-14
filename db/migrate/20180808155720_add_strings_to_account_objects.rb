class AddStringsToAccountObjects < ActiveRecord::Migration[5.1]
  def change
    add_column :account_objects, :normal_balance, :string, default: "Credit"
    add_column :account_objects, :object_type, :string
  end
end
