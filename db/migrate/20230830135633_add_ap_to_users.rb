class AddApToUsers < ActiveRecord::Migration[5.2]
  def change
    change_table :users do |t|
      t.boolean :ap,       null: false, default: false
    end
  end
end
