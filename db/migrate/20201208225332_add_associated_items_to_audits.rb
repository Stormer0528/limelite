class AddAssociatedItemsToAudits < ActiveRecord::Migration[5.2]
  def change
    add_column :audits, :associated_items, :jsonb, null: false, default: {}
  end
end
