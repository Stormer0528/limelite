module Resolvers
  class InvoiceResolver < Resolvers::BaseSearchResolver
    type types[Types::InvoiceType]
    description "Find Invoices"

    scope {
      context[:current_org].invoices
    }

    # Options
    option(:due_before, type: types.String)
    option(:due_after, type: types.String)
    option(:dated_before, type: types.String)
    option(:dated_after, type: types.String)
    option(:invoiceable_type, type: types.String)
    option(:invoiceable_id, type: types.ID)
    option(:preload, type: types.Boolean) {|scope, value|
      scope.includes(:invoiceable, entry: :entry_items, payments: :entry_item, checks: :bank_account) if value
    }
    option(:number, type: types.String) {|scope, value| scope.by_partial_number(value) unless value.blank?}
    option(:with_purchase_order, type: types.Boolean) {|scope, value| scope.with_purchase_order if value }
    option(:without_purchase_order, type: types.Boolean) {|scope, value| scope.without_purchase_order if value }
    option(:aasm_state, type: types.String)
    option(:paid, type: types.Boolean) do |scope, value|
      if value == false || value.blank?
        scope.unpaid
      end
    end

    option(:show_voided, type: types.Boolean) do |scope, value|
      if value == false
        scope.unvoided
      end
    end

    OrderEnum = GraphQL::EnumType.define do
      name "InvoiceOrder"

      value "CREATED_AT"
      value "DATE"
      value "DUE"
      value "NUMBER"
      value "STATE"
    end

    option :order, type: OrderEnum, default: "CREATED_AT"

    def apply_order_with_created_at(scope)
      scope.order "invoices.created_at DESC"
    end

    def apply_order_with_date(scope)
      scope.order "invoices.date DESC"
    end

    def apply_order_with_due(scope)
      scope.order "due_date DESC"
    end

    def apply_order_with_number(scope)
      scope.order "invoices.number DESC"
    end

    def apply_order_with_state(scope)
      scope.order "invoices.aasm_state DESC"
    end
  end
end
