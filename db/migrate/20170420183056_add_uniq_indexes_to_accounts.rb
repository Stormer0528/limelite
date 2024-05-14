class AddUniqIndexesToAccounts < ActiveRecord::Migration[5.0]
  def change
    add_index :account_functions, %i(code organization_id), unique: true
    add_index :account_funds, %i(code organization_id), unique: true
    add_index :account_goals, %i(code organization_id), unique: true
    add_index :account_locations, %i(code organization_id), unique: true
    add_index :account_objects, %i(code organization_id), unique: true
    add_index :account_resources, %i(code organization_id), unique: true
    add_index :account_years, %i(code organization_id), unique: true
  end
end
