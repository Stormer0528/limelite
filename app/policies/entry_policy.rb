class EntryPolicy < RolePolicy
  def destroy?
    if @record.bank_account_items.reconciled.empty? && @record.credit_card_items.reconciled.empty?
      return true if escalated_priveledges?

      super
    else
      false
    end
  end

  def delete?
    destroy?
  end

  def module_permission
    if @user_group&.module_permissions&.values&.include?("Owner")
      "Owner"
    elsif @user_group&.module_permissions&.values&.include?("Editor")
      "Editor"
    elsif @user_group&.module_permissions&.values&.include?("Viewer")
      "Viewer"
    else
      false
    end
  end

  def has_owner_permission?
    [escalated_priveledges? ||
     @user_group&.module_permissions&.dig("Vendor"),
     @user_group&.module_permissions&.dig("Account"),
     @user_group&.module_permissions&.dig("Customer"),
     @user_group&.module_permissions&.dig("CreditCard"),
     @user_group&.module_permissions&.dig("BankAccount")].any? {|perm| perm == "Owner" }
  end

  def has_editor_permission?
    escalated_priveledges? || [
      @user_group&.module_permissions&.dig("Vendor"),
      @user_group&.module_permissions&.dig("Account"),
      @user_group&.module_permissions&.dig("Customer"),
      @user_group&.module_permissions&.dig("CreditCard"),
      @user_group&.module_permissions&.dig("BankAccount")
    ].any? {|perm| ["Owner", "Editor"].include? perm }
  end

  def has_viewer_permission?
    escalated_priveledges? || [
      @user_group&.module_permissions&.dig("Vendor"),
      @user_group&.module_permissions&.dig("Account"),
      @user_group&.module_permissions&.dig("Customer"),
      @user_group&.module_permissions&.dig("CreditCard"),
      @user_group&.module_permissions&.dig("BankAccount")
    ].any? {|perm| ["Owner", "Editor", "Viewer"].include? perm }
  end
end
