Interfaces::BankItemInterface = GraphQL::InterfaceType.define do
  name "BankItemInterface"
  description "Common fields for Check, Deposit, Transfers for bank account"

  # field :creator,       Type::User
  field :aasm_state,      types.String
  field :account_id,      types.ID
  field :account,         Types::BankAccountType
  field :amount_in_cents, types.String
  field :amount,          types.String
  field :bank_account_id, types.ID
  field :created_at,      types.String
  field :creator_id,      types.ID
  field :entry_id,        types.ID
  field :file_url,        types.String
  field :id,              types.ID
  field :memo,            types.String
  field :printed,         types.Boolean
  field :updated_at,      types.String
  field :payee,           types.String
  field :date,            types.String
  field :number,          types.String

  field :type, !types.String do
    resolve ->(obj, _args, _ctx) {
      obj[:type].sub("BankAccount::", "")
    }
  end

  field :credit, types.String do
    resolve ->(obj, _args, _ctx) {
      obj[:amount_in_cents].negative? ? obj.amount.format : ""
    }
  end

  field :debit, !types.String do
    resolve ->(obj, _args, _ctx) {
      obj[:amount_in_cents].positive? ? obj.amount.format : ""
    }
  end

  field :reconciled, !types.Boolean do
    resolve ->(obj, _args, _ctx) {
      obj.reconciled?
    }
  end

  field :path, types.String do
    resolve ->(object, _args, _ctx) {
      "/bank_accounts/#{object.bank_account.slug}/#{object.type.demodulize.parameterize.pluralize}/#{object.id}"
    }
  end

  field :edit_path, types.String do
    resolve ->(object, _args, _ctx) {
      "/bank_accounts/#{object.bank_account.slug}/#{object.type.demodulize.parameterize.pluralize}/#{object.id}/edit"
    }
  end

  resolve_type ->(obj, _ctx) {
    case obj[:type]
    when "check"
      Types::CheckType
    when "BankAccount::Check"
      Types::CheckType
    when "deposit"
      Types::DepositType
    when "BankAccount::Deposit"
      Types::DepositType
    when "account_transfer"
      Types::AccountTransferType
    when "BankAccount::AccountTransfer"
      Types::AccountTransferType
    end
  }
end
