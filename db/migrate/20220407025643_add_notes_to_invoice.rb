class AddNotesToInvoice < ActiveRecord::Migration[5.2]
  def change
    add_column :invoices, :notes, :text
  end
end
