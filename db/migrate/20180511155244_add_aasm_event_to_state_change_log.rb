class AddAasmEventToStateChangeLog < ActiveRecord::Migration[5.1]
  def change
    add_column :state_change_logs, :event, :string
    rename_column :state_change_logs, :prev_state, :from_state
    rename_column :state_change_logs, :current_state, :to_state
  end
end
