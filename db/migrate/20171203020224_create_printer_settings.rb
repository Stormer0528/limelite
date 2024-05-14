class CreatePrinterSettings < ActiveRecord::Migration[5.1]
  def change
    create_table :printer_settings do |t|
      t.string :name
      t.string :slug
      t.string :printer_type
      t.integer :payee_offset_x, default: 0
      t.integer :payee_offset_y, default: 0
      t.integer :date_offset_x, default: 0
      t.integer :date_offset_y, default: 0
      t.integer :amount_offset_x, default: 0
      t.integer :amount_offset_y, default: 0
      t.integer :memo_offset_x, default: 0
      t.integer :memo_offset_y, default: 0
      t.integer :signature_offset_x, default: 0
      t.integer :signature_offset_y, default: 0
      t.integer :amount_text_offset_x, default: 0
      t.integer :amount_text_offset_y, default: 0
      t.integer :check_margin, default: 0
      t.references :organization

      t.timestamps
    end
  end
end
