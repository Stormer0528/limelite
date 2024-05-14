class AddRollUpToAccountObject < ActiveRecord::Migration[5.2]
  def change
    add_column :account_objects, :rollup, :string
  end
end
