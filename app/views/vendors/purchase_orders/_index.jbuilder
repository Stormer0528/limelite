json.array!(@purchase_orders) do |purchase_order|
  json.partial! 'vendors/purchase_orders/purchase_order', purchase_order: purchase_order
end
