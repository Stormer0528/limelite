class Types::AddressType < Types::BaseObject
  field :id, ID, null: true
  field :line1, String, null: true
  field :line2, String, null: true
  field :city, String, null: true
  field :state, String, null: true
  field :zip, String, null: true
  field :addressable_type, String, null: true
  field :addressable_id, Integer, null: true
  field :created_at, String, null: true
  field :updated_at, String, null: true
  field :name, String, null: true
  field :attention, String, null: true
  field :department, String, null: true
  field :empty, Boolean, null: true

  def empty
    object.empty?
  end
end
