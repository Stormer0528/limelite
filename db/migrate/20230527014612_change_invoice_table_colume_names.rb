class ChangeInvoiceTableColumeNames < ActiveRecord::Migration[5.2]
  def change
    change_table :invoices do |t|
      t.rename :account_objects_id, :account_object_id
      t.rename :addresses_id, :address_id
    end
  end
end
