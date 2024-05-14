class BatchUploadPolicy < ApplicationPolicy
  # This is the standard base policy to apply organization assignment rules
  # to all objects within an organization and without approval path rules

  def index?
    return true if escalated_priveledges?
    @current_user.organizations.include?(@current_org)
  end

  def show?
    index?
  end

  def create?
    index?
  end

  def update?
    create?
  end

  def destroy?
    return true if escalated_priveledges?
    @current_user.owned_organizations.include?(@current_org)
  end
end



