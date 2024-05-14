class ReAddUniqueIndexToBankAccountItemNumbers < ActiveRecord::Migration[5.1]
  def change
    execute <<-SQL
      CREATE UNIQUE INDEX index_bank_account_items_on_number_and_bank_account_id
      ON bank_account_items (number, bank_account_id)
      WHERE number <> '';
    SQL
  end
end
