class AddIndexToPhones < ActiveRecord::Migration[5.1]
  def change
    add_index :phones, [:phoneable_type, :phoneable_id]
  end
end
