class RestoreEntryReferenceToBankAccountItems < ActiveRecord::Migration[5.1]
  def change
    add_reference :bank_account_items, :entry, foreign_key: true
  end
end
