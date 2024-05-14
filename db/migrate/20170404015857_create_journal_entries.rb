class CreateJournalEntries < ActiveRecord::Migration[5.0]
  def change
    create_table :journal_entries do |t|
      t.integer :amount_in_cents
      t.string :memo
      t.boolean :is_transaction
      t.references :organization, foreign_key: true
      t.integer :creator_id, column: :users, foreign_key: true

      t.timestamps
    end
  end
end
