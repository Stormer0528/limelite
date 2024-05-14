class AddBackOfficeToUsers < ActiveRecord::Migration[5.0]
  def change
    add_column :users, :back_office, :boolean, default: false
  end
end
