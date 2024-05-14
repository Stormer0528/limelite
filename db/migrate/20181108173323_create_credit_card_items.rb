class CreateCreditCardItems < ActiveRecord::Migration[5.1]
  def change
    create_table :credit_card_items do |t|
      t.date :date, index: true
      t.string :memo
      t.string :file_url
      t.string :slug
      t.string :type
      t.references :entry, foreign_key: true
      t.monetize   :amount
      t.references :credit_card, foreign_key: true
      t.string :aasm_state, default: "draft"
      t.references :account, foreign_key: true
      t.references :vendor,  foreign_key: true

      t.timestamps
    end
    add_index :credit_card_items, :aasm_state
    add_index :credit_card_items, :type
  end
end
