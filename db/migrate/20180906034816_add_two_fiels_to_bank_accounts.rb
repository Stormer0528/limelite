class AddTwoFielsToBankAccounts < ActiveRecord::Migration[5.1]
  def change
    add_column :bank_accounts, :bank_name, :string
    add_column :bank_accounts, :fractional_number, :string
  end
end
