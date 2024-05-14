class UpdateAmountToBigInt < ActiveRecord::Migration[5.2]
  def change
    change_column :entry_items, :amount_in_cents, :bigint
  end
end
