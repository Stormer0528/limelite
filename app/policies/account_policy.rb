class AccountPolicy < StandardPolicy
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
      @user_group&.module_permissions&.dig("Account") || false
    end

    def resolve
      @scope.where(organization: @current_org)
    end
  end

  def module_permission
    @user_group&.module_permissions&.dig("Account") || false
  end
end
