class AddPrintedBooleanToBankAccountItem < ActiveRecord::Migration[5.1]
  def change
    add_column :bank_account_items, :printed, :boolean, default: false
  end
end
