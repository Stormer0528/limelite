class CreateTenNinetyNines < ActiveRecord::Migration[5.1]
  def change
    create_table :ten_ninety_nines do |t|
      t.references :address, foreign_key: true
      t.integer :year
      t.string :ein
      t.string :ein_type
      t.string :file_url
      t.boolean :required, default: false
      t.references :vendor, foreign_key: true

      t.timestamps
    end

    Vendor.all.find_each do |vendor|
      ten_ninety_nine = vendor.ten_ninety_nines.new \
        year:            2018,
        address_id:      vendor.ten_ninety_nine_address_id,
        ein:             vendor.ein,
        ein_type:        vendor.ein_type,
        required:        vendor.ten_ninety_nine,
        file_url:        vendor.file_url

      ten_ninety_nine.save(validate: false)
    end
  end
end
