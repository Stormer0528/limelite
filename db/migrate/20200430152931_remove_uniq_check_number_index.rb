class RemoveUniqCheckNumberIndex < ActiveRecord::Migration[5.1]
  def change
    remove_index :bank_account_items, name: "index_bank_account_items_on_number_and_bank_account_id"
  end
end
