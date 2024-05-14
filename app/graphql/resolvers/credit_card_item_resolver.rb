module Resolvers
  class CreditCardItemResolver < Resolvers::BaseSearchResolver
    type types[Interfaces::CreditCardItemInterface]
    description "Find Credit Card Items"

    scope { context[:current_org] ?  CreditCard::Item.joins(:credit_card).where(credit_cards: {organization_id: context[:current_org].id}) : CreditCard::Item.all }

    # Options
    option :printed,         type: types.Boolean
    option(:credit_card_id,  type: types.ID)     {|scope, value| scope.where(credit_card_id: value) }
    option(:start_date,      type: types.String) {|scope, value| scope.dated_after(Date.parse(value)) unless value.blank? }
    option(:end_date,        type: types.String) {|scope, value| scope.dated_before(Date.parse(value)) unless value.blank? }
    option(:month_ending_at, type: types.String) {|scope, value| scope.dated_between(Date.parse(value), Date.parse(value).beginning_of_month) unless value.blank?}
    option(:ids,             type: types.String) {|scope, value| scope.where(id: value.split(",")) unless value.blank? }
    option(:aasm_state,      type: types.String) {|scope, value| scope.where(aasm_state: parse_list_field(value)) unless value.blank? }
    option(:type,            type: types.String) {|scope, value| scope.where(type: "CreditCard::#{value.classify}") unless value.blank? }
    option(:memo,            type: types.String) {|scope, value| scope.by_partial_memo(value) unless value.blank? }
    option(:number,          type: types.String) {|scope, value| scope.by_partial_number(value) unless value.blank? }
    option(:min_amount,      type: types.String) {|scope, value| scope.by_min_amount(value.scan(/[.0-9]/).join().to_f) unless value.blank? }
    option(:max_amount,      type: types.String) {|scope, value| scope.by_max_amount(value.scan(/[.0-9]/).join().to_f) unless value.blank? }
    option(:vendor_id,       type: types.ID)     {|scope, value| scope.by_vendor_id(value) unless value.blank? }

    option(:reconciled,      type: types.Boolean) do |scope, value|
      unless value.nil?
        if value == false
          scope.unreconciled
        elsif value == true
          scope.reconciled
        end
      end
    end

    option(:include_entry,   type: types.Boolean) {|scope, value| scope.includes(:entry, entry: {entry_items: {account: [:account_fund, :account_resource, :account_year, :account_goal, :account_function, :account_object, :account_location]}}) unless value.blank?}
    option(:include_payment, type: types.Boolean) {|scope, value| scope.includes(:payment, payment: [:invoice]) unless value.blank?}
  end
end
