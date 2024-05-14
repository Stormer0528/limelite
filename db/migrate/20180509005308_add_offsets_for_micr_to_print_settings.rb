class AddOffsetsForMicrToPrintSettings < ActiveRecord::Migration[5.1]
  def change
    add_column :printer_settings, :micr_offset_x, :integer, default: 0
    add_column :printer_settings, :micr_offset_y, :integer, default: 0
  end
end
