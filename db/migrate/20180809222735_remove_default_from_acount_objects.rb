class RemoveDefaultFromAcountObjects < ActiveRecord::Migration[5.1]
  def change
    change_column :account_objects, :normal_balance, :string, default: nil
  end
end

