class CreditCardItemPolicy < RolePolicy
  def module_permission
    @user_group&.module_permissions&.dig("CreditCard") || false
  end
end
