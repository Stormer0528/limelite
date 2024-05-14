class RemoveDuplicateIndexes < ActiveRecord::Migration[5.1]
  def change
    remove_index :ap_aging_reports, [:slug, :organization_id]
    remove_index :ar_aging_reports, [:slug, :organization_id]
  end
end
