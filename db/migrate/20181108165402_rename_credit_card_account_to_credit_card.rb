class RenameCreditCardAccountToCreditCard < ActiveRecord::Migration[5.1]
  def change
    rename_table :credit_card_accounts, :credit_cards
    rename_column :credit_card_charges, :credit_card_account_id, :credit_card_id
    rename_column :credit_card_payments, :credit_card_account_id, :credit_card_id
  end
end
