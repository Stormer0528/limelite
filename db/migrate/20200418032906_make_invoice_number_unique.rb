class MakeInvoiceNumberUnique < ActiveRecord::Migration[5.1]
  def change
    remove_index :invoices, name: :index_invoices_on_number_and_invoiceable

    # Partial unique index
    execute <<-SQL
      CREATE UNIQUE INDEX index_invoices_on_number_and_invoiceable
      ON invoices (number, invoiceable_type, invoiceable_id)
      WHERE aasm_state != 'voided';
    SQL
  end
end
