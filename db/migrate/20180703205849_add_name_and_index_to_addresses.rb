class AddNameAndIndexToAddresses < ActiveRecord::Migration[5.1]
  def change
    add_column :addresses, :name, :string
    add_index :addresses, [:addressable_id, :addressable_type]
  end
end
