class CreateReportBudgetVsActualReports < ActiveRecord::Migration[5.1]
  def up
    create_table :report_budget_vs_actual_reports do |t|
      t.date :start_date
      t.date :end_date
      t.json :data
      t.references :organization, foreign_key: true
      t.references :account_fund, foreign_key: true
      t.string :slug

      t.timestamps
    end
  end

  def down
    drop_table :report_budget_vs_actual_reports
  end
end
