class AddFilesToBatchUploads < ActiveRecord::Migration[5.2]
  def change
    add_column :batch_uploads, :data, :json, default: {files: []}
  end
end
