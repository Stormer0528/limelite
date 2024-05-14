class CreateReportFinancialSummeryReports < ActiveRecord::Migration[5.1]
  def change
    create_table :report_financial_summary_reports do |t|
      t.date :start_date
      t.date :end_date
      t.string :name
      t.string :subtitle
      t.json :data
      t.references :organization, foreign_key: true
      t.string :status
      t.text :notes
      t.string :slug
      t.references :account_fund, foreign_key: true

      t.timestamps
    end

    add_index :report_financial_summary_reports, [:slug, :organization_id], name: :financial_summary_org_id, unique: true
  end
end
