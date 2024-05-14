class Types::PurchaseOrderItemType < Types::BaseObject
  field :id,                ID,      null: true
  field :purchase_order_id, ID,      null: true
  field :order,             Integer, null: true
  field :quantity,          Integer, null: true
  field :description,       String,  null: true
  field :price_in_cents,    Integer, null: true
  field :price_currency,    String,  null: true
  field :total_in_cents,    Integer, null: true
  field :total,             String,  null: true

  field :created_at,        String,  null: true
  field :updated_at,        String,  null: true

  def total
    object.total.format
  end
end
