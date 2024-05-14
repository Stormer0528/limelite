class StatementPolicy < RolePolicy
  def destroy?
    super && @record.reconciliations.count < 1
  end

  def module_permission
    @user_group.module_permissions.dig("BankAccount") ||
    @user_group.module_permissions.dig("CreditCard") || false
  end
end
