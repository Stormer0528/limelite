class Types::AuthorizationType < Types::BaseObject
  field :id, ID, null: true
  field :name, String, null: true
  field :user, Types::UserType, null: true
  field :user_group, Types::UserGroupType, null: true
  field :action, String, null: true
  field :reason, String, null: true
  field :group_id, ID, null: true
  field :group_name, String, null: true
  field :user_name, String, null: true

  field :created_at, String, null: false
  field :updated_at, String, null: false

  def group_id
    object&.user_group&.id
  end

  def group_name
    object&.user_group&.name
  end

  def user_name
    object&.user&.full_name
  end

  def created_at
    object.created_at.to_date
  end

  def updated_at
    object.updated_at.to_date
  end
end
