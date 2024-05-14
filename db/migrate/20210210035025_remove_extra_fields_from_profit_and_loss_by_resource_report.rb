class RemoveExtraFieldsFromProfitAndLossByResourceReport < ActiveRecord::Migration[5.2]
  def change
    remove_column :profit_and_loss_by_resource, :subtitle, :string
    remove_column :profit_and_loss_by_resource, :name, :string
    remove_column :profit_and_loss_by_resource, :notes, :text
  end
end
