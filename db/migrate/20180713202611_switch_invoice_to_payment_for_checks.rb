class SwitchInvoiceToPaymentForChecks < ActiveRecord::Migration[5.1]
  def change
    add_reference :bank_account_items, :payment, foreign_key: true
    remove_column :bank_account_items, :invoice_id
  end
end
