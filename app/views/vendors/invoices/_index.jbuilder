json.array!(@invoices) do |invoice|
  json.partial! 'invoices/invoice', invoice: invoice
end

