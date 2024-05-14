class AddJournalableIdToJournalEntry < ActiveRecord::Migration[5.0]
  def change
    add_column :journal_entries, :journalable_id, :integer
    add_column :journal_entries, :entry_type, :string

    add_index :journal_entries, :journalable_id
  end
end
