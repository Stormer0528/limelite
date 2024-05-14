class AddCreatorIdToVendors < ActiveRecord::Migration[5.1]
  def change
    add_reference :vendors, :creator, table_name: :users, foreign_key: {to_table: :users}
  end
end
