class AddCreatorToPayments < ActiveRecord::Migration[5.1]
  def change
    change_table(:payments) do |t|
      t.integer :creator_id,  column: :users, foreign_key: true, index: true
    end
  end
end
