class PaymentPolicy < StandardPolicy
  def module_permission
    @user_group&.module_permissions&.dig("Vendor") || @user_group&.module_permissions&.dig("Customer") || false
  end
end
