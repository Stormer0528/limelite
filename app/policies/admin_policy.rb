class AdminPolicy < ApplicationPolicy
  # User for all organization or system wide tasks only permissable to 
  # organization owners or back office/super admins

  def index?
    return true if escalated_priveledges?
    @current_user.editable_organizations.include?(@current_org) ||
      @current_user.owned_organizations.include?(@current_org)
  end

  def show?
    index?
  end

  def create?
    return true if escalated_priveledges?
    @current_user.owned_organizations.include?(@current_org)
  end

  def update?
    create?
  end

  def destroy?
    create?
  end

  class Scope < Scope
    def resolve
      if escalated_priveledges?
        scope.all
      end
        scope.joins(:organizations).where(organizations: {id: @current_org.id})
    end
  end
end
