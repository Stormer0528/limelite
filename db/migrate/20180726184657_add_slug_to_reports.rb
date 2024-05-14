class AddSlugToReports < ActiveRecord::Migration[5.1]
  def change
    add_column :cash_flow_reports, :slug, :string
    add_column :monthly_detail_reports, :slug, :string
    add_column :ap_aging_reports, :slug, :string
    add_column :ar_aging_reports, :slug, :string

    add_index :cash_flow_reports,      [:slug, :organization_id]
    add_index :monthly_detail_reports, [:slug, :organization_id]
    add_index :ap_aging_reports,       [:slug, :organization_id]
    add_index :ar_aging_reports,       [:slug, :organization_id]


    CashFlowReport.find_each(&:save)
    MonthlyDetailReport.find_each(&:save)
    ApAgingReport.find_each(&:save)
    ArAgingReport.find_each(&:save)
  end
end
