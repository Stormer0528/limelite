class AddOrganizationToBatchUploads < ActiveRecord::Migration[5.1]
  def change
    add_reference :batch_uploads, :organization, foreign_key: true
  end
end
