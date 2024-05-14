class AddOffsetsForDateToPrintSettings < ActiveRecord::Migration[5.1]
  def change
    add_column :printer_settings, :voucher1_offset_y, :integer, default: 0
    add_column :printer_settings, :voucher2_offset_y, :integer, default: 0

    add_column :printer_settings, :invoice_no_x, :integer, default: 0
    add_column :printer_settings, :invoice_no_y, :integer, default: 0

    add_column :printer_settings, :invoice_date_x, :integer, default: 0
    add_column :printer_settings, :invoice_date_y, :integer, default: 0

    add_column :printer_settings, :invoice_amount_x, :integer, default: 0
    add_column :printer_settings, :invoice_amount_y, :integer, default: 0

    add_column :printer_settings, :invoice_amount_paid_x, :integer, default: 0
    add_column :printer_settings, :invoice_amount_paid_y, :integer, default: 0

    add_column :printer_settings, :invoice_description_x, :integer, default: 0
    add_column :printer_settings, :invoice_description_y, :integer, default: 0
  end
end
