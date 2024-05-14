class AddAttentionAndDepartmentToAddresses < ActiveRecord::Migration[5.1]
  def change
    add_column :addresses, :attention, :string
    add_column :addresses, :department, :string
  end
end
