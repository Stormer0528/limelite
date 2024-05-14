class AddEmailAndPhoneToSchool < ActiveRecord::Migration[5.0]
  def change
    add_column :schools, :email, :string
    add_column :schools, :phone, :string
  end
end
