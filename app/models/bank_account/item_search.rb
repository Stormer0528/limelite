class BankAccount::ItemSearch
  include SearchObject.module

  scope { BankAccount::Item.all.includes(:bank_account) }

  option(:printed)          {|scope, value| scope.printed unless value.blank? }
  option(:bank_account_id)  {|scope, value| scope.where(bank_account_id: value) unless value.blank? }
  option(:start_date)       {|scope, value| scope.dated_after(Date.parse(value)) unless value.blank? }
  option(:end_date)         {|scope, value| scope.dated_before(Date.parse(value)) unless value.blank? }
  option(:month_ending_at)  {|scope, value| scope.dated_between(Date.parse(value), Date.parse(value).beginning_of_month) unless value.blank? }
  option(:ids)              {|scope, value| scope.where(id: value.split(",")) unless value.blank? }
  option(:aasm_state)       {|scope, value| scope.where(aasm_state: parse_list_field(value)) unless value.blank? }
  option(:type)             {|scope, value| scope.where(type: "BankAccount::#{value.classify}") unless value.blank? }
  option(:number)           {|scope, value| scope.by_partial_number(value) unless value.blank? }
  option(:memo)             {|scope, value| scope.by_partial_memo(value) unless value.blank? }
  option(:state)            {|scope, value| scope.by_state(value) unless value.blank? }
  option(:vendor_id)        {|scope, value| scope.by_vendor_id(value) unless value.blank? }
  option(:min_amount)       {|scope, value| scope.by_min_amount(value.scan(/[.0-9]/).join().to_f) unless value.blank? }
  option(:max_amount)       {|scope, value| scope.by_max_amount(value.scan(/[.0-9]/).join().to_f) unless value.blank? }
  option(:minAmount)        {|scope, value| scope.by_min_amount(value.scan(/[.0-9]/).join().to_f) unless value.blank? }
  option(:maxAmount)        {|scope, value| scope.by_max_amount(value.scan(/[.0-9]/).join().to_f) unless value.blank? }
  option(:approved)         {|scope, value| scope.approved unless value.blank? }

  # Note the different condition
  option(:reconciled)       {|scope, value| scope.unreconciled if value.blank? }

  option(:include_entry) {|scope, value| scope.includes(:entry, entry: {entry_items: {account: [:account_fund, :account_resource, :account_year, :account_goal, :account_function, :account_object, :account_location]}}) unless value.blank? }
  option(:include_payment) {|scope, value| scope.includes(:payment, payment: [:invoice]) unless value.blank? }

  def parse_list_field(value)
    value.split(",").map(&:strip)
  end
end
