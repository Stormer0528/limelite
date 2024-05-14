class Types::UserType < Types::BaseObject
  include Concerns::Permissable

  field :id, Integer, null: true
  field :slug, String, null: true

  field :first_name, String, null: true
  field :last_name, String, null: true
  field :full_name, String, null: true
  field :initials, String, null: true

  field :url, String, null: false, deprecation_reason: "Updating to _path to convention. Use User.path instead"
  field :edit_url, String, null: false,
                           deprecation_reason: "Updating to _path to convention. Use User.edit_path instead"

  field :path, String, null: false
  field :new_path, String, null: false
  field :edit_path, String, null: false

  # TODO: Hide if user is not admin
  field :admin_path, String, null: false
  field :admin_edit_path, String, null: false

  field :email, String, null: true
  field :avatar_url, String, null: true
  field :back_office, Boolean, null: true
  field :admin, Boolean, null: true
  field :archived, Boolean, null: true

  field :created_authorizables, [Unions::AuthorizableUnion, {null: true}], null: true
  field :authorizable_items, [Unions::AuthorizableUnion], null: true

  # RELATIONSHIPS
  field :organizations, [Types::OrganizationType], null: false
  field :organization_assignments, [Types::OrganizationAssignmentType], null: false
  field :owner_assignments, [Types::OrganizationAssignmentType], null: false
  field :editor_assignments, [Types::OrganizationAssignmentType], null: false
  field :viewer_assignments, [Types::OrganizationAssignmentType], null: false

  field :user_groups, [Types::UserGroupType], null: false
  field :current_user_group, Types::UserGroupType, null: true

  field :email_preference, String, null: false

  def admin
    object.admin?
  end

  def path
    "/users/#{object.slug}"
  end

  def edit_path
    "#{path}/edit"
  end

  def admin_path
    "/admin/#{path}"
  end

  def admin_edit_path
    "/admin/#{edit_path}"
  end

  def email_preference
    object.preferences.dig("email_notifications")
  end

  # Legacy fields
  def url
    admin_path
  end

  def edit_url
    admin_edit_path
  end

  def current_user_group
    object.user_groups.find_by organization: context[:current_org]
  end

  def created_authorizables
    object.created_authorizables(context[:current_org].id)
  end

  def authorizable_items
    object.authorizable_items(context[:current_org].id)
  end

  def organizations
    # Ensure alpha order and no duplicates
    object.organizations.unarchived.uniq { |org| org.id }
  end
end
