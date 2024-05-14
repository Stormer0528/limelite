class AddDashboard < ActiveRecord::Migration[5.2]
  def change
    create_table :report_dashboards do |t|
      t.date :start_date
      t.date :end_date
      t.json :data
      t.references :organization, foreign_key: true

      t.timestamps
    end
  end
end
