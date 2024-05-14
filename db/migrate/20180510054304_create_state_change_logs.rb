class CreateStateChangeLogs < ActiveRecord::Migration[5.1]
  def change
    create_table :state_change_logs do |t|
      t.references :user, foreign_key: true
      t.references :loggable, polymorphic: true, index: true
      t.text    :reason
      t.string  :prev_state
      t.string  :current_state

      t.timestamps
    end

    add_index :state_change_logs, :created_at
    add_index :state_change_logs, :updated_at
  end
end
