class AddOrganizationToPurchaseOrderToVendors < ActiveRecord::Migration[5.1]
  def up
    add_reference :purchase_orders, :organization, foreign_key: true

    PurchaseOrder.all.each do |po|
      po.update_attribute :organization_id, po.vendor.organization_id
    end
  end

  def down
    remove_reference :vendors, :organization, foreign_key: true
  end
end
