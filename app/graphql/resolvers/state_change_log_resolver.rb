module Resolvers
  class StateChangeLogResolver < Resolvers::BaseSearchResolver
    include SearchObject.module(:graphql)

    type [Types::StateChangeLogType]
    description "Find/Filter State Change Logs"

    scope { StateChangeLog.includes(:invoice).where.not(invoices: { organization_id: nil }) }

    # Options
    option(:id, type: types.ID)
    option(:user_id, type: types.ID)
    option(:reason, type: types.String) {|scope, value| scope.where("reason LIKE CONCAT('%',?,'%')", value) unless value.blank? }
    option(:from_state, type: types.String) {|scope, value| scope.where("from_state = ?", value) unless value.blank? }
    option(:to_state, type: types.String) {|scope, value| scope.where("to_state = ?", value) unless value.blank? }
    option(:start_date, type: types.String) {|scope, value| scope.where("state_change_logs.updated_at >= ?", Date.parse(value)) unless value.blank? }
    option(:end_date, type: types.String) {|scope, value| scope.where("state_change_logs.updated_at <= ?", Date.parse(value)) unless value.blank? }
    option(:organization_id, type: types.ID) {|scope, value| scope.where(invoices: { organization_id: value }) if value.to_i > 0 }

    OrderEnum = GraphQL::EnumType.define do
      name "StateLogOrder"

      value "CREATED_AT"
      value "UPDATED_AT"
      value "REASON"
      value "FROM_STATE"
      value "TO_STATE"
    end

    option :order, type: OrderEnum, default: "CREATED_AT"

    def apply_order_with_created_at(scope)
      scope.order "state_change_logs.created_at DESC"
    end

    def apply_order_with_updated_at(scope)
      scope.order "state_change_logs.updated_at DESC"
    end

    def apply_order_with_reason(scope)
      scope.order "state_change_logs.reason DESC"
    end

    def apply_order_with_from_state(scope)
      scope.order "state_change_logs.from_state DESC"
    end

    def apply_order_with_to_state(scope)
      scope.order "state_change_logs.to_state DESC"
    end
  end
end
