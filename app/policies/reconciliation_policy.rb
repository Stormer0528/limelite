# For Reconciliation#index
class ReconciliationPolicy < StandardPolicy
  def index?
    return true if escalated_priveledges?
    @organization_assignment&.present?
  end

  def show?
    index?
  end
end
