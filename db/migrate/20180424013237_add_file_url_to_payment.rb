class AddFileUrlToPayment < ActiveRecord::Migration[5.1]
  def change
    add_column :purchase_orders, :file_url, :string
    add_column :payments, :file_url, :string
    add_column :bank_account_items, :file_url, :string
    add_column :statements, :file_url, :string
  end
end
