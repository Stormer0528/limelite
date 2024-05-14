class AddInvoiceIdToPurchaseOrder < ActiveRecord::Migration[5.0]
  def change
    add_reference :purchase_orders, :invoice, foreign_key: true
  end
end
