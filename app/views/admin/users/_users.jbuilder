
json.users do
  json.array!(@users) do |user|
    json.id user.id
    json.name user.full_name
    json.email user.email
    json.selected false
    json.back_office user.back_office?
    json.created_at user.created_at
    json.updated_at user.updated_at
    json.view_path admin_user_path(user)
    json.edit_path edit_admin_user_path(user)
    json.destroy_path admin_user_path(user)
    json.roles do
      json.array!(user.organization_assignments) do |assignment|
        json.school_id assignment.organization_id
        json.name assignment.organization.name
        json.role assignment.type.sub("Assignment", "").downcase
      end
    end
  end
end
