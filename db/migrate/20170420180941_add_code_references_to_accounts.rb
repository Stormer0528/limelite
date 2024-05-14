class AddCodeReferencesToAccounts < ActiveRecord::Migration[5.0]
  def change
    add_reference :accounts, :account_function, foreign_key: true
    add_reference :accounts, :account_fund, foreign_key: true
    add_reference :accounts, :account_goal, foreign_key: true
    add_reference :accounts, :account_location, foreign_key: true
    add_reference :accounts, :account_object, foreign_key: true
    add_reference :accounts, :account_resource, foreign_key: true
    add_reference :accounts, :account_year, foreign_key: true
  end
end
