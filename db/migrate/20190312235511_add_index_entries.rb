class AddIndexEntries < ActiveRecord::Migration[5.1]
  def change
    add_index :entries, :date
    add_index :entries, :entry_type
    add_index :entry_items, :type
  end
end
