class AddAasmStateToCreditCardCharges < ActiveRecord::Migration[5.1]
  def change
    add_column :credit_card_charges, :aasm_state, :string, index: true
    add_column :credit_card_payments, :aasm_state, :string, index: true
  end
end
