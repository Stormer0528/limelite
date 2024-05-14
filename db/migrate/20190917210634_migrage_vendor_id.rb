class MigrageVendorId < ActiveRecord::Migration[5.1]
  def up
    BankAccount::Check.where.not(vendor_id: nil, entry_id: nil).find_each(batch_size: 250) do |check|
      check.entry.entry_items.each do |item|
        item.update_columns payable_type: "Vendor", payable_id: check.vendor_id
      end
    end

    # Hang on to this data for a while and don't delete
    remove_column :bank_account_items, :vendor_id
  end

  def down
  end
end
