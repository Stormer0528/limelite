class UpdateColumnDefaultForVendor1099 < ActiveRecord::Migration[5.1]
  def change
    change_column_default(:vendors, :ten_ninety_nine, from: false, to: nil)
  end
end
