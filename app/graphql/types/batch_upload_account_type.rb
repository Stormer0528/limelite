class Types::BatchUploadAccountType < Types::BaseObject
  field :account_id, ID, null: true
  field :account_number, String, null: true
  field :amount, Float, null: true
  field :account_name, String, null: true

  def account_number
    object["account_number"] || context[:current_org].accounts.find_by(id: object["account_id"])&.number
  end

  def account_name
    context[:current_org].accounts.find_by(id: object["account_id"])&.name
  end
end
