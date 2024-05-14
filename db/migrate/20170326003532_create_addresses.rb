class CreateAddresses < ActiveRecord::Migration[5.0]
  def change
    create_table :addresses do |t|
      t.string :line1
      t.string :line2
      t.string :city
      t.string :state
      t.string :zip
      t.string :addressable_type
      t.integer :addressable_id, foreign_key: true

      t.timestamps
    end
  end
end
