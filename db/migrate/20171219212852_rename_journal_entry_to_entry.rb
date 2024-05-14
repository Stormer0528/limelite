class RenameJournalEntryToEntry < ActiveRecord::Migration[5.1]
  def change
    rename_table :journal_entries, :entries
    rename_column :entry_items, :journal_entry_id, :entry_id
  end
end
