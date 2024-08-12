class AddUploadOnlyToUser < ActiveRecord::Migration[5.2]
  def change
    change_table :users do |t|
      t.boolean :upload_only,       null: false, default: false
    end
  end
end
