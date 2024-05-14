class CreateVendors < ActiveRecord::Migration[5.0]
  def change
    create_table :vendors do |t|
      t.string :company
      t.text :notes
      t.string :email
      t.string :other
      t.string :website
      t.string :account_number
      t.string :county_number
      t.boolean :active
      t.text :payment_terms
      t.boolean :global
      t.string :ein
      t.boolean :do_not_use
      t.decimal :sales_tax_rate, precision: 6, scale: 2
      t.string :name
      t.integer :rating
      t.string :owner

      t.timestamps
    end
    add_index :vendors, :ein, unique: true
  end
end
