class CreateArAgingReports < ActiveRecord::Migration[5.1]
  def change
    create_table :ar_aging_reports do |t|
      t.date :start_date
      t.date :end_date
      t.string :name
      t.string :subtitle
      t.string :aging_method, default: 'CURRENT'
      t.integer :days_per_period, default: 30
      t.boolean :show_active_columns, default: true
      t.boolean :show_active_rows, default: true
      t.integer :periods, default: 3
      t.json :data, default: Hash.new
      t.references :organization
      t.string :status, default: "New"
      t.text :notes

      t.timestamps
    end
  end
end
