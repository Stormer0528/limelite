class CreateBankAccounts < ActiveRecord::Migration[5.1]
  def change
    create_table :bank_accounts do |t|
      t.string :pseudo
      t.string :number
      t.string :name
      t.monetize :starting_balance
      t.text :description
      t.date :started_at
      t.date :ended_at
      t.string :edp_number
      t.string :state_account_number
      t.references :organization, foreign_key: true

      t.timestamps
    end

    change_table :account_transfers do |t|
      t.references :bank_account, foreign_key: true
      t.integer    :from_bank_account_id, index: true
    end

    change_table :checks do |t|
      t.references :bank_account, foreign_key: true
      t.references :vendor, foreign_key: true
      # t.string :payee
    end

    change_table :deposits do |t|
      t.references :bank_account, foreign_key: true
    end
  end
end
