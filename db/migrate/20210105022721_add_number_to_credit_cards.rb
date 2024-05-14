class AddNumberToCreditCards < ActiveRecord::Migration[5.2]
  def change
    add_column :credit_card_items, :number, :string
    # remove_column :credit_card_items, :date, :date
    # remove_column :credit_card_items, :amount_in_cents, :integer
    # remove_column :credit_card_items, :amount_currency, :string
  end
end
