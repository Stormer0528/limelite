class AddFileUrlToEntries < ActiveRecord::Migration[5.2]
  def change
    add_column :entries, :file_url, :string
  end
end
