class AddDirectionToPrinterSettings < ActiveRecord::Migration[5.1]
  def change
    add_column :printer_settings, :direction, :string, default: "ASC"
  end
end
