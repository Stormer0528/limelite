class AddBackupFileUrlToEntry < ActiveRecord::Migration[5.1]
  def change
    add_column :entries, :backup_file_url, :string
  end
end
