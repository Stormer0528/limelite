class CreateBatchUploads < ActiveRecord::Migration[5.1]
  def change
    create_table :batch_uploads do |t|
      t.integer :total_invoices
      t.integer :critical_invoices
      t.text :notes
      t.integer :creator_id
      t.string :aasm_state

      t.timestamps
    end
  end
end
