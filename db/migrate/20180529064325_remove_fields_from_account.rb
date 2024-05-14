class RemoveFieldsFromAccount < ActiveRecord::Migration[5.1]
  def up
    remove_column :accounts, :start_date
    remove_column :accounts, :end_date
    remove_column :accounts, :county_account_number
  end

  def down
    add_column :accounts, :start_date, :datetime
    add_column :accounts, :end_date, :datetime
    add_column :accounts, :county_account_number, :string
  end
end
