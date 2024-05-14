class CreateEntryItems < ActiveRecord::Migration[5.1]
  def change
    create_table :entry_items do |t|
      t.references :journal_entry, foreign_key: true
      t.monetize :amount
      t.string :type
      t.references :account, foreign_key: true

      t.timestamps
    end
  end
end
