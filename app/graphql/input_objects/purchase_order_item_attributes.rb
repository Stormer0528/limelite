class InputObjects::PurchaseOrderItemAttributes < Types::BaseInputObject
  description "Properties for creating a PurchaseOrderItem"

  argument :order, Integer, required: false
  argument :quantity, Integer, required: false
  argument :description, String, required: false
  argument :price_in_cents, Integer, required: false

  argument :purchase_order_id, ID, required: false
  argument :id,                ID, required: false
end
