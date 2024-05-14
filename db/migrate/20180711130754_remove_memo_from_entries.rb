class RemoveMemoFromEntries < ActiveRecord::Migration[5.1]
  def up
    remove_column :entries, :memo
  end

  def down
    add_column :entries, :memo, :string
  end
end
