class AddDateToInvoices < ActiveRecord::Migration[5.1]
  def change
    add_index :invoices, :date
  end
end
