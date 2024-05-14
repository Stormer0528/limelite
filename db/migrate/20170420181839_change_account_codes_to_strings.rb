class ChangeAccountCodesToStrings < ActiveRecord::Migration[5.0]
  def change
    change_column :account_functions, :code, :string
    change_column :account_funds, :code, :string
    change_column :account_goals, :code, :string
    change_column :account_locations, :code, :string
    change_column :account_objects, :code, :string
    change_column :account_resources, :code, :string
    change_column :account_years, :code, :string
  end
end
