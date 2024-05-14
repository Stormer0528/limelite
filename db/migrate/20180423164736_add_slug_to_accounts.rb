class AddSlugToAccounts < ActiveRecord::Migration[5.1]
  def change
    add_column :accounts, :slug, :string

    Customer.all.map(&:save)
  end
end
