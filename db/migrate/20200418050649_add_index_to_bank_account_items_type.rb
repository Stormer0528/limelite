class AddIndexToBankAccountItemsType < ActiveRecord::Migration[5.1]
  def change
    add_index :bank_account_items, :type
  end
end
