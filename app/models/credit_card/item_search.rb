require "search_object"

class CreditCard::ItemSearch
  include SearchObject.module

  scope { CreditCard::Item.all.includes(:credit_card) }

  option :printed
  option(:credit_card_id)   {|scope, value| scope.where(credit_card_id: value) }
  option(:start_date)       {|scope, value| value.present? ? scope.dated_after(Date.parse(value)) : scope }
  option(:end_date)         {|scope, value| value.present? ? scope.dated_before(Date.parse(value)) : scope }
  option(:month_ending_at)  {|scope, value|
    scope.dated_between(Date.parse(value), Date.parse(value).beginning_of_month)
  }
  option(:ids)              {|scope, value| scope.where(id: value.split(",")) }
  option(:aasm_state)       {|scope, value| value.present? ? scope.by_state(value) : scope }
  option(:type)             {|scope, value| scope.where(type: "CreditCard::#{value&.classify}") if value.present? }
  option(:number)           {|scope, value| value.present? ? scope.by_partial_number(value) : scope }
  option(:memo)             {|scope, value| value.present? ? scope.by_partial_memo(value) : scope }
  option(:state)            {|scope, value| value.present? ? scope.by_state(value) : scope }
  option(:vendor_id)        {|scope, value| scope.by_vendor_id(value) }
  option(:min_amount)       {|scope, value| value.present? ? scope.by_min_amount(value) : scope }
  option(:max_amount)       {|scope, value| value.present? ? scope.by_max_amount(value) : scope }
  option(:minAmount)        {|scope, value| value.present? ? scope.by_min_amount(value) : scope }
  option(:maxAmount)        {|scope, value| value.present? ? scope.by_max_amount(value) : scope }

  option(:reconciled) do |scope, value|
    if value == false
      scope.unreconciled
    elsif value == true
      scope.reconciled
    else
      scope
    end
  end

  option(:include_entry) {|scope, value|
    if value
      scope.includes(:entry,
                     entry: {entry_items: {account: [:account_fund, :account_resource, :account_year, :account_goal, :account_function,
                                                     :account_object, :account_location]}})
    end
  }
  option(:include_payment) {|scope, value| scope.includes(:payment, payment: [:invoice]) if value }
end
