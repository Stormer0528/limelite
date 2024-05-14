class CreateReportMonthlyProfitLossReports < ActiveRecord::Migration[5.1]
  def change
    create_table :report_monthly_profit_loss_reports do |t|
      t.date :start_date
      t.date :end_date
      t.string :name
      t.string :subtitle
      t.json :data
      t.references :organization, foreign_key: true
      t.references :account_fund, foreign_key: true
      t.text :notes
      t.string :slug

      t.timestamps
    end
  end
end
