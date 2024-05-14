class AddPayableIdToEntryItem < ActiveRecord::Migration[5.1]
  def change
    add_reference :entry_items, :payable, polymorphic: true, index: true
  end
end
