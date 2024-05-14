module Resolvers
  class BankItemResolver < Resolvers::BaseSearchResolver
    type types[Unions::BankItemUnion]
    description "Find Bank Account Items"

    scope { context[:current_org] ?
      BankAccount::Item
        .includes(:bank_account, :invoices, :reconciliation)
        .where(bank_accounts: {organization_id: context[:current_org].id})
        .order(:date)
        .preload(address: :addressable)
        : BankAccount::Item.all
      }

    # Options
    option(:printed,         type: types.Boolean) {|scope, value| scope.printed unless value.blank?}
    option(:approved,        type: types.Boolean) {|scope, value| scope.approved unless value.blank?}
    option(:bank_account_id, type: types.ID)     {|scope, value| scope.where(bank_account_id: value)}
    option(:start_date,      type: types.String) {|scope, value| scope.dated_after(Date.parse(value)) unless value.blank?}
    option(:end_date,        type: types.String) {|scope, value|
      begin
        scope.dated_before(Date.parse(value)) unless value.blank?
      rescue ArgumentError
        scope.dated_before(Date.today)
      end
    }
    option(:month_ending_at, type: types.String) {|scope, value| scope.dated_between(Date.parse(value), Date.parse(value).beginning_of_month) unless value.blank?}
    option(:ids,             type: types.String) {|scope, value| scope.where(id: value.split(",")) unless value.blank?}
    option(:aasm_state,      type: types.String) {|scope, value| scope.where(aasm_state: parse_list_field(value)) unless value.blank?}
    option(:type,            type: types.String) {|scope, value| scope.where(type: "BankAccount::#{value.classify}") unless value.blank?}
    option(:memo,            type: types.String) {|scope, value| scope.by_partial_memo(value) unless value.blank? }
    option(:number,          type: types.String) {|scope, value| scope.by_partial_number(value) unless value.blank? }
    option(:min_amount,      type: types.String) {|scope, value| scope.by_min_amount(value.scan(/[.0-9]/).join().to_f) unless value.blank? }
    option(:max_amount,      type: types.String) {|scope, value| scope.by_max_amount(value.scan(/[.0-9]/).join().to_f) unless value.blank? }
    option(:vendor_id,       type: types.ID) {|scope, value| scope.by_vendor_id(value) unless value.blank? }

    # Note the different condition
    option(:reconciled, type: types.Boolean) {|scope, value| scope.unreconciled if value.blank? }

    option(:beginning_balance, type: types.Boolean) do |scope, value|
      unless value.nil?
        if value == false
          scope.unreconciled
        elsif value == true
          scope.reconciled
        end
      end
    end

    option(:include_entry,   type: types.Boolean) {|scope, value| scope.includes(:entry, entry: {entry_items: {account: [:account_fund, :account_resource, :account_year, :account_goal, :account_function, :account_object, :account_location]}}) unless value.blank?}
    option(:include_payment, type: types.Boolean) {|scope, value| scope.includes(payments: [:invoice]) unless value.blank?}
  end
end
