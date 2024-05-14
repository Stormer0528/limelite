class AddStartingBalanceToVendors < ActiveRecord::Migration[5.1]
  def change
    add_monetize :vendors, :starting_balance
  end
end
