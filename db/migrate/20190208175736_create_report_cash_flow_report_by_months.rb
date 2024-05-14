class CreateReportCashFlowReportByMonths < ActiveRecord::Migration[5.1]
  def change
    create_table :report_cash_flow_report_by_months do |t|
      t.date :start_date
      t.date :end_date
      t.string :name
      t.string :subtitle
      t.json :data, null: false, default: {}
      t.references :organization, foreign_key: true
      t.text :notes
      t.string :slug

      t.timestamps
    end

    # Pre-create reports
    Organization.all.each do |org|
      org.cash_flow_by_month_reports.create start_date: Date.today.beginning_of_month, end_date: Date.today.end_of_month
    end
  end
end
