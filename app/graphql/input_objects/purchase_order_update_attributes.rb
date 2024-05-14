class InputObjects::PurchaseOrderUpdateAttributes < InputObjects::PurchaseOrderAttributes
  description "Attributes for Updating a purchase order"

  argument :id, ID, required: true
end
