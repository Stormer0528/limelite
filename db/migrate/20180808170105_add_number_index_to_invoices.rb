class AddNumberIndexToInvoices < ActiveRecord::Migration[5.1]
  def change
    add_index :invoices, [:number, :invoiceable_type, :invoiceable_id],
      name: "index_invoices_on_number_and_invoiceable", unique: true
  end
end
