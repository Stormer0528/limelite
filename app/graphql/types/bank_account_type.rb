class Types::BankAccountType < Types::BaseObject
  description "A Bank Account Belonging to a Organization"
  include Concerns::Permissable

  field :id, ID, null: true
  field :account, Types::AccountType, null: true
  field :account_object, Types::Account::AccountObject, null: true
  field :bank_name, String, null: true
  field :balance, String, null: true
  field :description, String, "User description of the account", null: true
  field :edp_number, String, null: true
  field :name, String, "User name for the account", null: true
  field :number, String, null: true
  field :pseudo, String, null: true
  field :routing_number, String, null: true
  field :slug, String, null: true
  field :last_statement_balance, String, "balance of last statement", null: true
  field :last_reconciled_date, String,  "ended_at date for most recent reconciliation", null: true

  field :started_at, String, "The Date the bank account was started", null: false
  field :ended_at, String, "The Date the bank account was ended", null: true

  field :items, [Interfaces::BankItemInterface, null: true], null: true
  field :statements, [Types::StatementType, null: true], null: true

  field :starting_balance, Float, "balance at the beginning of the account", null: true
  field :state_account_number, String, null: true

  field :created_at, String, "The DateTime the bank account record was created", null: false
  field :updated_at, String, "The DateTime the bank account record was last updated", null: false

  field :path, String, null: false

  def balance
    if object.account_object.nil?
      return '$0.00'
    end

    object.account_object&.balance.format(sign_before_symbol: true)
  end

  def last_statement_balance
    object.last_statement_balance.format(sign_before_symbol: true)
  end

  def path
    "/bank_accounts/#{object.slug}"
  end

  def edit_path
    "#{path}/edit"
  end

  def started_at
    object.started_at&.to_formatted_s(:std)
  end

  def ended_at
    object.ended_at&.to_formatted_s(:std)
  end

  def last_reconciled_date
    object.last_reconciled_date&.to_formatted_s(:std)
  end

  def number
    "X" * (object.number.length - 4).clamp(0, 10) + object.number.last(4)
  end
end
