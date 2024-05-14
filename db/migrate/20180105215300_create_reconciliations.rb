class CreateReconciliations < ActiveRecord::Migration[5.1]
  def change
    create_table :reconciliations do |t|
      t.references :organization, foreign_key: true
      t.references :bank_account, foreign_key: true
      t.references :statement, foreign_key: true
      t.references :entry, foreign_key: true

      t.timestamps
    end
  end
end
