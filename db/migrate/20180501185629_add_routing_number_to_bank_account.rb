class AddRoutingNumberToBankAccount < ActiveRecord::Migration[5.1]
  def change
    add_column :bank_accounts, :routing_number, :string
  end
end
