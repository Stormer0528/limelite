class AddCreatorIdToStatement < ActiveRecord::Migration[5.1]
  def change
    change_table(:statements) do |t|
    t.integer :creator_id,  column: :users, foreign_key: true, index: true
    t.integer :approver_id, column: :users, foreign_key: true, index: true
    t.boolean :approved
    end
  end
end
