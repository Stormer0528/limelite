class RemoveSitesAndSchools < ActiveRecord::Migration[5.1]
  def change
    drop_table :sites
    drop_table :schools
  end
end
