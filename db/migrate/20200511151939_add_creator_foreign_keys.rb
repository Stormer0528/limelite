class AddCreatorForeignKeys < ActiveRecord::Migration[5.1]
  def change
    add_index :bank_account_items, :creator_id
    add_index :batch_uploads, :creator_id
    add_index :credit_card_items, :creator_id
    add_index :entries, :creator_id
    add_index :payments, :creator_id
    add_index :statements, :creator_id

    add_foreign_key :bank_account_items, :users, column: :creator_id
    add_foreign_key :batch_uploads, :users, column: :creator_id
    add_foreign_key :credit_card_items, :users, column: :creator_id
    add_foreign_key :entries, :users, column: :creator_id
    add_foreign_key :payments, :users, column: :creator_id
    add_foreign_key :statements, :users, column: :creator_id
    add_foreign_key :printer_settings, :organizations
    add_foreign_key :credit_cards, :organizations
  end
end
