class AddRestrictedToResource < ActiveRecord::Migration[5.1]
  def change
    add_column :account_resources, :slug, :string
    add_column :account_resources, :restricted, :boolean

    AccountResource.find_each(&:save)
  end
end
