class CreateAccountReconciliationItems < ActiveRecord::Migration[5.1]
  def change
    create_table :account_reconciliation_items do |t|
      t.references :organization, foreign_key: true
      t.references :bank_account, foreign_key: true
      t.references :account_reconciliation, foreign_key: true
      t.integer :account_element_type
      t.integer :account_element_id, foreign_key: true

      t.timestamps
    end
  end
end
