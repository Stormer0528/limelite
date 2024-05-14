class CreateReportVendor1099Reports < ActiveRecord::Migration[5.1]
  def change
    create_table :report_vendor1099_reports do |t|
      t.date :start_date
      t.date :end_date
      t.string :name
      t.string :subtitle
      t.json :data
      t.references :vendor, foreign_key: true
      t.references :organization, foreign_key: true
      t.text :notes
      t.string :slug

      t.timestamps
    end
  end
end
