class CreateInvoices < ActiveRecord::Migration[5.0]
  def change
    create_table :invoices do |t|
      t.references :vendor, foreign_key: true
      t.string :number
      t.date :date
      t.text :description
      t.date :due_date
      t.integer :amount_in_cents

      t.timestamps
    end
  end
end
