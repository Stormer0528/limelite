class AddPayableIdToPayments < ActiveRecord::Migration[5.1]
  def change
    add_reference :payments, :payable, polymorphic: true, index: true

    # Migrate payments
    Payment.find_each do |p|
      is_customer = p.vendor_id&.present?
      p.update  payable_id:   is_customer ? p.vendor_id : p.customer_id,
                payable_type: is_customer ? "Customer::Payment" : "Vendor::Payment"
    end

    remove_column :payments, :vendor_id
    remove_column :payments, :customer_id
  end
end
