module Types
  class UserGroupType < Types::BaseObject
    field :id, ID, null: true
    field :name, String, null: true
    field :parent, Types::UserGroupType, null: true
    field :parent_id, ID, null: true
    field :siblings, [Types::UserGroupType], null: true
    field :children, [Types::UserGroupType], null: true
    field :child_count, Integer, null: false
    field :module_permissions, String, null: false
    field :approval_amount, Integer, null: false

    field :organization, Types::OrganizationType, null: true
    field :users, [Types::UserType], null: true
    field :items_awaiting_authorization, [Unions::AuthorizableUnion], null: true

    field :module_permissions, Types::ModulePermissionsType, null: true

    # field :authorizations, [Types::AuthorizationType], null: true

    def child_count
      object.children.count
    end

    def approval_amount
      return 0 if object.is_a? Hash

      object&.module_permissions&.dig("approval_amount") || 0
    end

    def users
      object.users.unarchived
    end
  end
end
