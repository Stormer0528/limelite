class AddObjectRelationToBankAccount < ActiveRecord::Migration[5.1]
  def change
    add_reference :bank_accounts, :account_object, foreign_key: true
    remove_reference :bank_accounts, :account
  end
end
