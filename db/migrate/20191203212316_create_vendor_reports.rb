class CreateVendorReports < ActiveRecord::Migration[5.1]
  def change
    create_table :report_vendor_reports do |t|
      t.date :start_date
      t.date :end_date
      t.jsonb :data
      t.references :organization, foreign_key: true

      t.timestamps
    end
  end
end
