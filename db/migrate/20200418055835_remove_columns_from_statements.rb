class RemoveColumnsFromStatements < ActiveRecord::Migration[5.1]
  def change
    remove_column :statements, :approved
    remove_column :statements, :approver_id
  end
end
