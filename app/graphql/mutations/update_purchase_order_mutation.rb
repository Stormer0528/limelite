class Mutations::UpdatePurchaseOrderMutation < Mutations::BaseMutation
  null true
  type Types::PurchaseOrderType

  argument :purchase_order, InputObjects::PurchaseOrderUpdateAttributes, required: true
  argument :state_action, String, required: false
  argument :reason, String, required: false

  def resolve(purchase_order: {}, state_action: nil, reason: nil)
      current_user = context[:current_user]
      po = PurchaseOrder.find purchase_order[:id]

      po.purchase_order_items.each do |item|
        item.mark_for_destruction
      end

      po.assign_attributes purchase_order.to_h

      po.save if state_action == "save_draft"

      if po.valid? && state_action != "save_draft"
        po.send(state_action, user_id: current_user.id, reason: reason || "",
                     admin: current_user.admin?)
      end

      po
  end
end
