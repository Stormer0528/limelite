class BankItemPolicy < RolePolicy
  def save_draft?
    return true if escalated_priveledges?
    
        has_editor_permission? && (
      [:draft, :needs_revision].include?(@record.aasm_state.to_sym) ||
      (@record.creator_id == @user.id && @record.aasm_state.to_sym == :needs_approval)
    )
  end

  def module_permission
    @user_group&.module_permissions&.dig("BankAccount") || false
  end
end
