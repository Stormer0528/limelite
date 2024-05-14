json.extract! payment, :id, :vendor_id, :invoice_id, :purchase_order_id, :final_pay, :amount_in_cents, :date, :tax_amount_in_cents, :shipping_amount_in_cents, :created_at, :updated_at
json.url payment_url(payment, format: :json)
