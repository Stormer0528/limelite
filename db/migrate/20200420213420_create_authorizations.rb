class CreateAuthorizations < ActiveRecord::Migration[5.1]
  def change
    create_table :authorizations do |t|
      t.references :user, foreign_key: true
      t.references :user_group, foreign_key: true
      t.references :authorizable, polymorphic: true
      t.string :action
      t.string :reason

      t.timestamps
    end
  end
end
