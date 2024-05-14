class DropColumnsFromCreditCardItems < ActiveRecord::Migration[5.1]
  def change
    remove_columns :credit_card_items, :slug
    remove_index :credit_card_items, column: :creator_id
    remove_columns :credit_card_items, :account_id
  end
end
