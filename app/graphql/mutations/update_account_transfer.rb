class Mutations::UpdateAccountTransfer < Mutations::BaseMutation
  null true
  type Types::AccountTransferType

  argument :account_transfer, InputObjects::AccountTransferUpdateAttributes, required: false
  argument :state_action, String, required: false
  argument :reason, String, required: false

  def resolve(**args)
    current_user = context[:current_user]
    account_transfer = BankAccount::AccountTransfer.find args[:account_transfer].id

    # Deposit entry attributes
    if account_transfer.entry
      orig_item_ids = account_transfer.entry.entry_items.map{|item| item.id.to_s}
      new_item_ids = args.to_h["accountTransfer"].dig(:entry_attributes, :entry_items_attributes).map {|v| v[:id] if v[:id] }.compact
      delete_item_ids = orig_item_ids - new_item_ids

      account_transfer.entry.entry_items.each do |item|
        item.mark_for_destruction if delete_item_ids.include?(item.id.to_s)
      end
    end

    account_transfer.assign_attributes args[:account_transfer].to_h

    account_transfer.save if args[:state_action] == "save_draft"

    if account_transfer.persisted? && args[:state_action] != "save_draft"
      account_transfer.send(args[:state_action], user_id: current_user.id,
                            reason: args[:reason] || "",
                            admin: current_user.admin?)
    end

    account_transfer
  end
end
