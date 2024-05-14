class InvoicePolicy < RolePolicy
  ## Extra Role Permission for Invoice
  def void?
    escalated_priveledges? || has_editor_permission?
  end

  def module_permission
    @user_group&.module_permissions&.dig("Vendor") || @user_group&.module_permissions&.dig("Customer") || false
  end
end
