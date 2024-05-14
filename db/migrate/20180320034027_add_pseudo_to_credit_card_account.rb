class AddPseudoToCreditCard < ActiveRecord::Migration[5.1]
  def change
    add_column :credit_cards, :pseudo, :string
  end
end
