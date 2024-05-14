class RenameArApAgingReportTable < ActiveRecord::Migration[5.1]
  def change
    rename_table :ap_aging_reports, :report_ap_aging_reports
    rename_table :ar_aging_reports, :report_ar_aging_reports
  end
end
