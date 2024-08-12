# Special Policy for Reports
# Call Requestors who are editors cannot view reports
# All other Editors/Owners are able to view
class ReportPolicy < ApplicationPolicy
  def index?
    return true if escalated_priveledges?

    return false if @current_user.upload_only?

    return true if @user_group

    @organization_assignment.type != "ViewerAssignment" && @organization_assignment.role != "Call Requestor"
  end

  def module_permission
    @user_group&.module_permissions&.dig("Report") || false
  end
end
