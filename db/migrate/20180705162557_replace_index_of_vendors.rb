class ReplaceIndexOfVendors < ActiveRecord::Migration[5.1]
  def change
    remove_index :vendors, :ein
    add_index :vendors, :ein, unique: true, where: 'ein IS NOT NULL'
  end
end
