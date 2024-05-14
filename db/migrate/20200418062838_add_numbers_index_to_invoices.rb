class AddNumbersIndexToInvoices < ActiveRecord::Migration[5.1]
  def change
    add_index :invoices, :number
  end
end
