class AddAccountToBankAccount < ActiveRecord::Migration[5.1]
  def change
    add_reference :bank_accounts, :account, foreign_key: true
  end
end
