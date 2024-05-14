class AddInvoiceableIdToInvoices < ActiveRecord::Migration[5.1]
  def change
    add_reference :invoices, :invoiceable, polymorphic: true, index: true

    # Migrate invoices
    Invoice.find_each do |p|
      is_customer = p.vendor_id&.present?
      p.update  invoiceable_id:   is_customer ? p.vendor_id : p.customer_id,
                invoiceable_type: is_customer ? "Customer" : "Vendor"
    end

    remove_column :invoices, :vendor_id
    remove_column :invoices, :customer_id
  end
end
