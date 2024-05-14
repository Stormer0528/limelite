class RenamePrintedForBankAccountItems < ActiveRecord::Migration[5.1]
  def change
    rename_column :bank_account_items, :printed, :paper_check
  end
end
