class AddAddressBankAccountToInvoice < ActiveRecord::Migration[5.2]
  def change
    change_table :invoices do |t|
      t.references :account_objects, foreign_key: true, :null => true
      t.references :addresses, foreign_key: true, :null => true
    end
  end
end
