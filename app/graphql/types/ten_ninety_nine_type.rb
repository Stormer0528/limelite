module Types
  class TenNinetyNineType < Types::BaseObject
    field :id,              ID,      null: false
    field :address_id,      ID,      null: true
    field :ein_type,        String,  null: true
    field :ein,             String,  null: true
    field :required,        Boolean, null: true
    field :year,            Integer, null: false
    field :file_url,        String,  null: true

    field :created_at,      String,  null: true
    field :updated_at,      String,  null: true

    # RELATIONSHIPS
    field :vendor,  Types::Vendor,      null: false
    field :address, Types::AddressType, null: true
  end
end
