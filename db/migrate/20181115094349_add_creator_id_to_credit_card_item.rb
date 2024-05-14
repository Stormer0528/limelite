class AddCreatorIdToCreditCardItem < ActiveRecord::Migration[5.1]
  def change
    add_column :credit_card_items, :creator_id, :bigint
    add_index :credit_card_items, :creator_id
  end
end
