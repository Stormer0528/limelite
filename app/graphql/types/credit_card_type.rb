class Types::CreditCardType < Types::BaseObject
  include Concerns::Permissable

  field :id, ID, null: true

  field :description, String, null: true
  field :limit_currency, String, null: true
  field :limit_in_cents, Integer, null: true
  field :limit, String, null: true
  field :name, String, null: true
  field :number, String, null: true
  field :pseudo, String, null: true
  field :slug, String, null: true
  field :starting_balance_currency, String, null: true
  field :starting_balance_in_cents, Integer, null: true
  field :starting_balance, String, null: true
  field :balance, String, null: true
  field :last_statement_balance, String, null: true

  field :items, [Interfaces::CreditCardItemInterface, {null: true}], null: true
  field :statements, [Types::StatementType, {null: true}], null: true

  field :started_at, String, null: true
  field :ended_at, String, null: true
  field :created_at, String, null: true
  field :updated_at, String, null: true

  field :last_reconciled_date, String, null: true

  field :path, String, null: false
  field :edt_path, String, null: false

  def path
    "/credit_cards/#{object.slug}"
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

  def last_statement_balance
    object.last_statement_balance.format
  end

  def balance
    object.balance&.format
  end
end
