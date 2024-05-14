class VendorPolicy < RolePolicy
  def reverse_approval?
    return true if escalated_priveledges?

    has_editor_permission?
  end

  def approve?
    return true if escalated_priveledges?
    has_owner_permission?
  end

  class Scope
    attr_reader :user, :scope

    def initialize(authorization_context, scope)
      @user         = authorization_context.user
      @current_user = authorization_context.user
      @organization = authorization_context.organization
      @current_org  = authorization_context.organization
      @organization_assignment = authorization_context.organization_assignment
      @scope = scope
    end

    def module_permission
      @user_group&.module_permissions&.dig("Vendor") || false
    end

    def resolve
      @scope
    end
  end
end
