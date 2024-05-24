class FilePolicy < ApplicationPolicy
  def create?
    @current_user.ap? || ["Owner", "Editor"].include?(@user_group&.module_permissions&.dig("Report"))
  end

  def view?
    return true if escalated_priveledges?

    if @user_group.nil? && ["apanalyst01@iconsm.com", "avickers@iconsm.com", "eson@iconsm.com", "jneddersen@iconsm.com"].include?(@current_user.email)
      return true
    end

    @current_user.ap? || ["Owner", "Editor", "Viewer"].include?(@user_group&.module_permissions&.dig("Report"))
  end
end