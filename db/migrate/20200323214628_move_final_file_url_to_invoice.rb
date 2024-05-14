class MoveFinalFileUrlToInvoice < ActiveRecord::Migration[5.1]
  def change
    add_column :invoices, :final_payment_url, :string
    remove_column :payments, :file_url, :string
  end
end
