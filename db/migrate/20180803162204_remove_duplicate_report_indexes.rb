class RemoveDuplicateReportIndexes < ActiveRecord::Migration[5.1]
  def change
    remove_index :cash_flow_reports, [:slug, :organization_id]
    remove_index :monthly_detail_reports, [:slug, :organization_id]
  end
end
