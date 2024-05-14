class AddInvoiceFileField < ActiveRecord::Migration[5.1]
  def change
    add_column :invoices, :file_url, :string
  end
end
