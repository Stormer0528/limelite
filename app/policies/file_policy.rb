class FilePolicy < ApplicationPolicy
  def create?
    @current_user.ap? || ["Owner", "Editor"].include?(@user_group&.module_permissions&.dig("Report"))
  end

  def view?
    @current_user.ap? || ["Owner", "Editor", "Viewer"].include?(@user_group&.module_permissions&.dig("Report"))
  end
end