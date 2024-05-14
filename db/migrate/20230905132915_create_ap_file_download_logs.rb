class CreateApFileDownloadLogs < ActiveRecord::Migration[5.2]
  def change
    create_table :ap_file_download_logs do |t|
      t.references :user, foreign_key: true
      t.references :file_upload, foreign_key: true
      t.timestamps
    end
  end
end
