class Types::DenialNotificationType < Types::BaseObject
  graphql_name "DenialNotification"

  field :authorizable, Unions::AuthorizableUnion, null: true
  field :organization, Types::OrganizationType, null: true
  field :user, Types::UserType, null: true
  field :reason, String, null: true
end
