class RemoveAmountInCentsFromPayments < ActiveRecord::Migration[5.1]
  def change
remove_column :payments, :amount_in_cents
  end
end
