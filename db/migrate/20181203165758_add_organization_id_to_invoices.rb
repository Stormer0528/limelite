class AddOrganizationIdToInvoices < ActiveRecord::Migration[5.1]
  def up
    add_reference :invoices, :organization, foreign_key: true
    add_column    :invoices, :paid, :boolean, default: false

    Invoice.find_each do |invoice|
      invoice.update_columns paid: invoice.paid?, organization_id: invoice.invoiceable&.organization_id
    end
  end

  def down
    remove_reference :invoices, :organization, foreign_key: true
  end
end
