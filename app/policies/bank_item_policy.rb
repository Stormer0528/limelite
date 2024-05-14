class BankItemPolicy < RolePolicy
  def module_permission
    @user_group&.module_permissions&.dig("BankAccount") || false
  end
end
