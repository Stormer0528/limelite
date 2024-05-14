class AddStartDateAndEndDateToVendors < ActiveRecord::Migration[5.1]
  def change
    add_column :vendors, :start_date, :date
    add_column :vendors, :end_date, :date
  end
end
