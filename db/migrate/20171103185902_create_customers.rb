class CreateCustomers < ActiveRecord::Migration[5.1]
  def change
    create_table :customers do |t|
      t.string :title
      t.string :first_name
      t.string :last_name
      t.string :middle_name
      t.string :suffix
      t.string :company
      t.string :email
      t.string :website
      t.text :notes
      t.references :organization, foreign_key: true

      t.timestamps
    end
  end
end
