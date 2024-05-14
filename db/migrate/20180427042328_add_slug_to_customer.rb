class AddSlugToCustomer < ActiveRecord::Migration[5.1]
  def change
    add_column :customers, :slug, :string
  end
end
