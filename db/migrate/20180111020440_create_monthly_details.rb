class CreateMonthlyDetails < ActiveRecord::Migration[5.1]
  def change
    create_table :monthly_detail_reports do |t|
      t.date :start_date
      t.date :end_date
      t.string :name
      t.string :subtitle
      t.string :accounting_method, default: 'Cash'
      t.string :display_columns_by, default: 'Total'
      t.boolean :show_active_columns, default: true
      t.boolean :show_active_rows, default: true
      t.json :data, default: Hash.new
      t.references :organization
      t.string :status, default: "New"
      t.text :notes

      t.timestamps
    end
  end
end
