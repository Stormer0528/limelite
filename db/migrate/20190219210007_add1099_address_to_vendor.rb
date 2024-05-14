class Add1099AddressToVendor < ActiveRecord::Migration[5.1]
  def change
    add_reference(:vendors, :ten_ninety_nine_address, foreign_key: {to_table: :addresses})
    remove_reference(:report_vendor1099_reports, :vendor)
  end
end
