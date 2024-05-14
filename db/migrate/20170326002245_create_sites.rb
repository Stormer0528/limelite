class CreateSites < ActiveRecord::Migration[5.0]
  def change
    create_table :sites do |t|
      t.string :sub_domain
      t.string :slug
      t.references :school, foreign_key: true

      t.timestamps
    end
  end
end
