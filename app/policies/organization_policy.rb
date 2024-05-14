class OrganizationPolicy < ApplicationPolicy
  def index?
    return true if escalated_priveledges?
    @current_user.organization_assignments.present?
  end

  def show?
    return true if escalated_priveledges?
    @current_user.organizations.include?(@current_org)
  end

  def create?
    return true if escalated_priveledges?
  end

  def update?
    return true if escalated_priveledges?
  end

  def destroy?
    @current_user.super_admin?
  end

  def update_users?
    return true if escalated_priveledges?
    @current_user.owned_organizations.include? @record
  end

  class Scope < Scope
    def resolve
      if escalated_priveledges?
        scope.all
      else
        scope.joins(:users).where(users: {id: @current_user.id})
      end
    end
  end
end
