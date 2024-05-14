class Types::OrganizationAssignmentType < Types::BaseObject
  field :id, ID, null: false
  field :user_id, ID, null: false
  field :organization_id, ID, null: false
  field :type, String, null: false
  field :role, String, null: true

  field :user, Types::UserType, null: false
  field :organization, Types::OrganizationType, null: false
end
