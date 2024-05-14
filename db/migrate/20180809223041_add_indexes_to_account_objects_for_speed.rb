class AddIndexesToAccountObjectsForSpeed < ActiveRecord::Migration[5.1]
  def change
    add_index :account_objects, :normal_balance
    add_index :account_objects, :object_type
  end
end
