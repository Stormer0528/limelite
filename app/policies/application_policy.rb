class ApplicationPolicy
  attr_reader :user, :record

  def initialize(authorization_context, record)
    @user         = authorization_context.user
    @current_user = authorization_context.user

    @organization = authorization_context.organization
    @current_org  = authorization_context.organization

    @record = record
    @organization_assignment = authorization_context.organization_assignment
    @user_group = @user.user_groups.find_by organization: @organization
  end

  def module_permission
    @user_group&.module_permissions&.dig(record_class_name) || false
  end

  def record_class_name
    name = if @record.is_a?(String)
             @record.classify
           elsif record.is_a?(Symbol)
             @record.to_s.classify
           else
             @record.class.name
           end

    # If a class is passed instead of an instance of a record,
    # class name is "Class"
    name == "Class" ? @record.name : name
  end

  def index?
    false
  end

  def show?
    false
  end

  def create?
    false
  end

  def new?
    create?
  end

  def update?
    false
  end

  def edit?
    update?
  end

  def destroy?
    false
  end

  def has_owner_permission?
    escalated_priveledges? || module_permission == "Owner"
  end

  def has_editor_permission?
    escalated_priveledges? || module_permission == "Owner" || module_permission == "Editor"
  end

  def has_viewer_permission?
    escalated_priveledges? || !!module_permission
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

    def resolve
      @scope.all
    end

    private

    def escalated_priveledges?
      @user.super_admin? || @user.back_office?
    end
  end

  def escalated_priveledges?
    @user.super_admin? || @user.back_office?
  end
end
