class RemoveVendor1099Fields < ActiveRecord::Migration[5.1]
  def up
    remove_column :report_vendor1099_reports,  :name
    remove_column :report_vendor1099_reports,  :subtitle
    remove_column :report_vendor1099_reports,  :notes
    remove_column :report_vendor1099_reports,  :slug
  end

  def down
    add_column :report_vendor1099_reports,  :name, :string
    add_column :report_vendor1099_reports,  :subtitle, :string
    add_column :report_vendor1099_reports,  :notes, :text
    add_column :report_vendor1099_reports,  :slug, :string
  end
end
