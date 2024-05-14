class AddUniquePrinterSettingsName < ActiveRecord::Migration[5.1]
  def change
    add_index :printer_settings, [:name, :organization_id], unique: true
  end
end
