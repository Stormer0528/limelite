class CreateReportBalanceSheetByMonths < ActiveRecord::Migration[5.1]
  def change
    create_table :report_balance_sheet_by_months do |t|
      t.date :start_date, default: 1.year.ago
      t.date :end_date, default: 1.day.ago
      t.json :data, default: {account_search_params: {}}
      t.references :organization, foreign_key: true

      t.timestamps
    end
  end
end
