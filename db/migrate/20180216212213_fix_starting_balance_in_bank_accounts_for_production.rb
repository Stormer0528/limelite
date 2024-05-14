class FixStartingBalanceInBankAccountsForProduction < ActiveRecord::Migration[5.1]
  def change
    unless column_exists?(:bank_accounts, :starting_balance_in_cents)
      change_table :bank_accounts do |t|
        t.monetize :starting_balance
      end
    end
  end
end
