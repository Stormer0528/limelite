class CreateBankAccountItems < ActiveRecord::Migration[5.1]
  def change
    create_table :bank_account_items do |t|
      t.monetize :amount
      t.date :date
      t.string :memo
      t.string :payee
      t.string :number
      t.string :slug
      t.string :type

      t.references :entry,        foreign_key: true
      t.references :vendor,       foreign_key: true
      t.references :bank_account, foreign_key: true

      t.integer :creator_id, column: :users,   foreign_key: true
      t.integer :from_bank_account_id, column: :bank_accounts, foreign_key: true

      t.timestamps
    end
  end
end
