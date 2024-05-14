module Types
  class DepartmentType < Types::BaseObject
    field :id, ID, null: true
    field :name, String, null: true
    field :organization, Types::OrganizationType, null: false
    field :account, Types::AccountType, null: false
    field :users, [Types::UserType], null: false
  end
end
