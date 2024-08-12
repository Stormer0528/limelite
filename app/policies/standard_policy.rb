class StandardPolicy < ApplicationPolicy
  # This is the standard base policy to apply organization assignment rules
  # to all objects within an organization and without approval path rules

  def index?
    return false if @current_user.upload_only?
    has_viewer_permission?
  end

  def show?
    index?
  end

  def view?
    show?
  end

  def create?
    has_editor_permission?
  end

  def update?
    has_editor_permission?
  end

  def destroy?
    has_owner_permission?
  end

  def delete?
    destroy?
  end
end
