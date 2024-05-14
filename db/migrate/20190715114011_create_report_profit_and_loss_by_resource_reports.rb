class CreateReportProfitAndLossByResourceReports < ActiveRecord::Migration[5.1]
  def change
    create_table :profit_and_loss_by_resource do |t|
      t.date :start_date
      t.date :end_date
      t.string :name
      t.string :subtitle
      t.json :data
      t.references :organization, foreign_key: true
      t.text :notes
      t.string :slug

      t.timestamps
    end
  end
end
