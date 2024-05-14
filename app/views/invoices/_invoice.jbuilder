json.extract! invoice, :id, :invoiceable_id, :invoiceable_name, :aasm_state, :number, :date, :description, :due_date, :created_at, :updated_at
json.amount number_to_currency(invoice.amount)
json.amount_paid number_to_currency(invoice.amount_paid)
json.amount_remaining number_to_currency(invoice.amount_remaining)
json.paid invoice.paid?
json.path vendor_invoice_url(invoice.invoiceable.slug, invoice.slug)
json.edit_path edit_vendor_invoice_url(invoice.invoiceable.slug, invoice.slug)
json.invoiceable_path vendor_url(invoice.invoiceable)

# Permissions
json.partial! 'shared/permissions', item: invoice
