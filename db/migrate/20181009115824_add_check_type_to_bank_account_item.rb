class AddCheckTypeToBankAccountItem < ActiveRecord::Migration[5.1]
  def change
    add_column :bank_account_items, :check_type, :string
  end
end
