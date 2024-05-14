module Resolvers
  class PurchaseOrderResolver < Resolvers::BaseSearchResolver
    type types[Types::PurchaseOrderType]
    description "Find Purchase Orders"

    scope { context[:current_org].purchase_orders.includes(:vendor) }

    # Options
    option(:id, type: types.ID)
    option(:vendor_id, type: types.ID)
    option(:number, type: types.String) {|scope, value| scope.by_partial_number(value) unless value.blank? }
    option(:invoice_number, type: types.String) {|scope, value|
      scope.by_partial_invoice_number(value) unless value.blank?
    }
    option(:date_needed, type: types.String)
    option(:buyer, type: types.String)
    option(:requisition_number, type: types.String)
    option(:requested_by, type: types.String)
    option(:requested_for, type: types.String)
    option(:slug, type: types.String)
    option(:vendor_ein, type: types.String)
    option(:aasm_state, type: types.String)

    option(:with_invoice,    type: types.Boolean) {|scope, value| scope.with_invoice if value }
    option(:without_invoice, type: types.Boolean) {|scope, value| scope.without_invoice if value }

    option(:preload_invoice, type: types.Boolean) {|scope, value|
      scope.includes(:invoice) if value
    }
  end
end
