class CreateDenialNotifications < ActiveRecord::Migration[5.2]
  def change
    create_table :denial_notifications do |t|
      t.references :organization, foreign_key: true
      t.references :user, foreign_key: true
      t.references :authorizable, polymorphic: true, index: {name: "authable_deny_items"}
      t.string :reason

      t.timestamps
    end
  end
end
