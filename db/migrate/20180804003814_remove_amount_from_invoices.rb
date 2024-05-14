class RemoveAmountFromInvoices < ActiveRecord::Migration[5.1]
  def change
    remove_column :invoices, :amount_in_cents
  end
end
