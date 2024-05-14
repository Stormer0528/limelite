class AddUsersAndMetadataToFileUploads < ActiveRecord::Migration[5.1]
  def change
    add_reference :file_uploads, :organization, foreign_key: true
    add_reference :file_uploads, :creator, table_name: :users, foreign_key: {to_table: :users}

    add_column :file_uploads, :description, :string
    add_column :file_uploads, :file_type, :string
  end
end
