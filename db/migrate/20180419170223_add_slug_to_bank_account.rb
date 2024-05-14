class AddSlugToBankAccount < ActiveRecord::Migration[5.1]
  def change
    add_column :bank_accounts, :slug, :string, index: true
    add_column :credit_cards, :slug, :string, index: true

    BankAccount.find_each(&:save)
    CreditCard.find_each(&:save)
  end
end
