class AddPreferencestoUsers < ActiveRecord::Migration[5.2]
  def change
    add_column :users, :preferences, :jsonb, default: {email_notifications: "summary"}
  end
end
