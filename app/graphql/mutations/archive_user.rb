class Mutations::ArchiveUser < Mutations::BaseMutation
  null true

  argument :user_id, ID, required: true
  description "Remove a user from all organizations and mark as archived"

  type Types::BaseResponse

  def resolve(user_id:)
    begin
      user = User.find(user_id)

      # Check if user can update
      auth_ctx = AuthorizationContext.new context[:current_user], context[:current_org]
      policy = AdminUsersPolicy.new auth_ctx, user

      unless policy.destroy?
        return {success: false, error_messages: ["insufficient permission to delete this user"]}
      end

      # check for admin
      if user.admin? && !context[:current_user].super_admin?
        return {success: false, error_messages: ["unable to delete admin user"]}
      end

      # remove from organizations
      user.organization_assignments.map(&:destroy)

      # mark as locked/archived
      return {success: true} if user.update_columns(locked_at: DateTime.now, archived: true)

      return {success: false, error_messages: user.errors.full_messages}

    rescue ActiveRecord::RecordNotFound
      return {success: false, error_messages: ["unable to find user"]}
    rescue StandardError => e
      {success: false, error_messages: [e.message]}
    end
  end
end
