class AddSlugToAccountElements < ActiveRecord::Migration[5.1]
  def change
    add_column :account_functions, :slug, :string, index: true
    add_column :account_funds, :slug, :string, index: true
    add_column :account_goals, :slug, :string, index: true
    add_column :account_locations, :slug, :string, index: true
    add_column :account_objects, :slug, :string, index: true
    add_column :account_years, :slug, :string, index: true

    AccountFunction.find_each(&:save)
    AccountFund.find_each(&:save)
    AccountGoal.find_each(&:save)
    AccountLocation.find_each(&:save)
    AccountObject.find_each(&:save)
    AccountYear.find_each(&:save)
  end
end
