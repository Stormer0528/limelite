class AddMemoToEntryItem < ActiveRecord::Migration[5.1]
  def change
    add_column :entry_items, :memo, :string
  end
end
