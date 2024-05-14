# Basic Approval Actions

json.approval_actions do
  json.array! do
    item.aasm.events(admin: @current_user.admin?).map(&:name)
  end
end
