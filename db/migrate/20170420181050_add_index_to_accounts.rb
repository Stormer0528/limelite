class AddIndexToAccounts < ActiveRecord::Migration[5.0]
  def change
    add_index :accounts,  %i(organization_id account_function_id
                            account_fund_id account_goal_id
                            account_location_id account_object_id
                            account_resource_id account_year_id),
                          unique: true,
                          name: "index_accounts_on_multiple_references"
  end
end
