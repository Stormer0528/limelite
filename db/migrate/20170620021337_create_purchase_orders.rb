class CreatePurchaseOrders < ActiveRecord::Migration[5.0]
  def change
    create_table :purchase_orders do |t|
      t.references :vendor, foreign_key: true
      t.string :number
      t.date :date_needed
      t.boolean :blanket
      t.boolean :stock_po
      t.string :status
      t.string :buyer
      t.string :requisition_number
      t.string :requested_by
      t.string :requested_for

      t.timestamps
    end
  end
end
