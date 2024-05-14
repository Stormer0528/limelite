class CreateFileUploads < ActiveRecord::Migration[5.1]
  def change
    create_table :file_uploads do |t|
      t.references :uploadable, polymorphic: true, index: true
      t.string :url

      t.timestamps
    end
  end
end
