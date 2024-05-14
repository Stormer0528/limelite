class AddSlugToVendors < ActiveRecord::Migration[5.1]
  def change
    # Add Slugs
    add_column :vendors, :slug, :string
    add_column :invoices, :slug, :string
    add_column :purchase_orders, :slug, :string
    remove_reference :payments, :purchase_order

    Vendor.all.map(&:save)
    Invoice.all.map(&:save)
    PurchaseOrder.all.map(&:save)
  end
end
