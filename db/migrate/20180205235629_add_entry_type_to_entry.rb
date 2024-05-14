class AddEntryTypeToEntry < ActiveRecord::Migration[5.1]
  def change
    remove_column :entries, :journalable_id
    add_reference :entries, :journalable, polymorphic: true, index: true
  end
end
