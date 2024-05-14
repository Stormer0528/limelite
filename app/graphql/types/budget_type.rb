module Types
  class BudgetType < Types::BaseObject
    field :id, ID, null: true
    field :fiscal_year, Integer, null: true
    field :account_id, ID, null: true
    field :amount, String, null: true
    field :amount_in_cents, Integer, null: true
  end

  def amount
    object.amount.format true
  end
end
