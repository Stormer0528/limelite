class Mutations::CreatePurchaseOrderMutation < Mutations::BaseMutation
  null true
  type Types::PurchaseOrderType

  argument :purchase_order, InputObjects::PurchaseOrderAttributes, required: true
  argument :state_action, String, required: false
  argument :reason, String, required: false

  def resolve(purchase_order: {}, state_action: nil, reason: nil)
      current_user = context[:current_user]
      po = PurchaseOrder.new purchase_order.to_h

      po.assign_attributes  creator:      current_user,
                            organization: context[:current_org]

      po.save

      if po.valid? && state_action != "save_draft"
        po.send(state_action, user_id: current_user.id, reason: reason || "",
                     admin: current_user.admin?)
      end

      po
  end
end
