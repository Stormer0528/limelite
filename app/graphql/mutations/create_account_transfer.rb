class Mutations::CreateAccountTransfer < Mutations::BaseMutation
  null true
  type Types::AccountTransferType

  argument :account_transfer, InputObjects::AccountTransferAttributes, required: false
  argument :state_action, String, required: false
  argument :reason, String, required: false

  def resolve(**args)
    current_user = context[:current_user]
    account_transfer = BankAccount::AccountTransfer.new args[:account_transfer].to_h

    account_transfer.assign_attributes creator: current_user
    account_transfer.entry.assign_attributes creator:      current_user,
                                             organization: context[:current_org]

    account_transfer.save

    if account_transfer.valid? && args[:state_action] != "save_draft"
      account_transfer.send(args[:state_action], user_id: current_user.id,
                            reason: args[:reason] || "",
                            admin: current_user.admin?)
    end

    account_transfer
  end
end
