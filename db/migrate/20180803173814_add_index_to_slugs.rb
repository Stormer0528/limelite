class AddIndexToSlugs < ActiveRecord::Migration[5.1]
  def change
    %i(
      accounts ap_aging_reports ar_aging_reports bank_accounts cash_flow_reports
      credit_cards customers monthly_detail_reports printer_settings
      vendors
    ).each do |table|
      add_column(:slug, table, :string) unless column_exists?(:slug, table)
      add_index table, :slug
      add_index table, [:slug, :organization_id], unique: true
    end

    add_index :invoices, :slug
    add_index :invoices, [:slug, :invoiceable_type, :invoiceable_id],
      name: "index_invoices_on_slug_invoiceable", unique: true
    add_index :purchase_orders, :slug
    add_index :purchase_orders, [:slug, :vendor_id], unique: true
  end
end
