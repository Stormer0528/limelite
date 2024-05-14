json.extract! invoice, :id, :customer_id, :number, :date, :description, :due_date, :created_at, :updated_at
json.customer_name invoice.customer.name
json.amount number_to_currency(invoice.amount)
json.amount_paid number_to_currency(invoice.amount_paid)
json.amount_remaining number_to_currency(invoice.amount_remaining)
json.path customer_invoice_url(invoice.customer, invoice)
json.edit_path edit_customer_invoice_url(invoice.customer, invoice)
json.customer_path customer_url(invoice.customer)
