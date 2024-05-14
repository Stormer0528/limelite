class AddNumberToCustomer < ActiveRecord::Migration[5.1]
  def change
    add_column :customers, :number, :string, index: true
  end
end
