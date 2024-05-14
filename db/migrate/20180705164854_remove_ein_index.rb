class RemoveEinIndex < ActiveRecord::Migration[5.1]
  def change
    remove_index :vendors, :ein
  end
end
