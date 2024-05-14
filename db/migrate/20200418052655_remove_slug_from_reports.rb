class RemoveSlugFromReports < ActiveRecord::Migration[5.1]
  def change
    remove_column :profit_and_loss_by_resource, :slug
  end
end
