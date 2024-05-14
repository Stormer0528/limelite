class RemoveSalesTaxRateFromVendor < ActiveRecord::Migration[5.1]
  def change
    remove_column :vendors, :sales_tax_rate
  end
end
