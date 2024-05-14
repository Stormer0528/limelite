class PurchaseOrderPolicy < RolePolicy
  def create?
    return true if escalated_priveledges?

    # Differentiate between class or instance check
    if @record.is_a?(PurchaseOrder)
      @record.vendor&.aasm_state == "approved"
    else
      @organization_assignment.type != "ViewerAssignment"
    end
  end

  def save_draft?
    create?
  end

  def send_for_approval?
    create?
  end

  def authorize?
    if @record.is_a?(PurchaseOrder)
      # Authorization only happens in the needs_approval step
      return false if @record.aasm_state != "needs_approval"
      # Admins can always authorize
      return true if escalated_priveledges?

      # Other users can only authorize if user_group is the current_auth_group
      p "should return: #{(@user.user_groups.include? @record.current_auth_group)}"
      @user.user_groups.include? @record.current_auth_group
    end
  end
end
