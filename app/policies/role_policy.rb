class RolePolicy < StandardPolicy
  def save_draft?
    return true if escalated_priveledges?

    # if viewer/editor should be owner of content
    # if owner allow
    has_editor_permission? && [:draft, :needs_revision].include?(@record.aasm_state.to_sym)
  end

  def send_for_approval?
    save_draft?
  end

  def approve?
    return true if escalated_priveledges?

    has_editor_permission? # && current_user_group_is_approver?
  end

  def authorize?
    return true if escalated_priveledges? || has_owner_permission?

    return true if has_editor_permission? && !@record.respond_to?(:authorizations)

    # Check Editor's group is up
    return @record.authorizations.last&.user_group == @user_group if has_editor_permission?

    false
  end

  def deny?
    approve?
  end

  def reverse_approval?
    return true if escalated_priveledges?

    has_owner_permission?
  end

  def current_user_group_is_approver?
    @record.authorizations.order(updated_at: :desc).where(user_id: nil, user_group_id: @user_group.id).count > 0
  end
end
