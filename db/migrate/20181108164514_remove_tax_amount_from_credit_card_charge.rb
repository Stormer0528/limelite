class RemoveTaxAmountFromCreditCardCharge < ActiveRecord::Migration[5.1]
  def change
    remove_column :credit_card_charges, :tax_amount_currency, :string, null: false
    remove_column :credit_card_charges, :tax_amount_in_cents, :integer, null: false
  end
end
