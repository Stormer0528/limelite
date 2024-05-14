class AddCreatortoCustomer < ActiveRecord::Migration[5.2]
  def change
    add_reference :customers, :creator, table_name: :users, foreign_key: {to_table: :users}
    add_reference :invoices, :creator, table_name: :users, foreign_key: {to_table: :users}
    add_reference :bank_accounts, :creator, table_name: :users, foreign_key: {to_table: :users}
    add_reference :credit_cards, :creator, table_name: :users, foreign_key: {to_table: :users}
  end
end
