class AddPolymorphicFieldsToStatement < ActiveRecord::Migration[5.1]
  def up
    add_reference :statements, :reconcilable, polymorphic: true, index: true

    Statement.all.find_each do |statement|
      statement.update reconcilable_id: statement.bank_account_id, reconcilable_type: "BankAccount"
    end

    remove_reference :statements, :bank_account
  end

  def down
    add_reference :statements, :bank_account

    Statement.all.find_each do |statement|
      statement.update bank_account_id: statement.reconcilable_id
    end

    remove_reference :statements, :reconcilable, polymorphic: true, index: true
  end
end
