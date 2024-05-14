class DropSlugFromBankAccountItems < ActiveRecord::Migration[5.1]
  def change
    remove_column :bank_account_items, :slug
  end
end
