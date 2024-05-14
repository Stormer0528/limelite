json.extract! purchase_order, :id, :vendor_id, :number, :date_needed, :buyer, :requisition_number, :created_at, :updated_at, :invoice_number
json.amount_remaining number_to_currency(purchase_order.invoice_amount_remaining)
json.path ""
json.edit_path ""
json.requested_by ""
json.requested_for ""
json.vendor_path vendor_url(purchase_order.vendor)
json.invoice_path (purchase_order.vendor && purchase_order.invoice && vendor_invoice_url(purchase_order.vendor.slug, purchase_order.invoice.slug))

# Permissions
json.partial! "shared/permissions", item: purchase_order
