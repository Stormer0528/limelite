class AddReferenceToBankAccountItems < ActiveRecord::Migration[5.1]
  def change
    add_reference :bank_account_items, :invoice, foreign_key: true
  end
end
