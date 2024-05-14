class Resolvers::EntryItemResolver < Resolvers::BaseSearchResolver
  type types[Types::EntryItemType]
  description "Find and filter entries"

  scope { EntryItem.includes(:entry, :account, account: [:account_fund, :account_resource, :account_year, :account_goal, :account_function, :account_object, :account_location])
                   .where(entries: {organization_id: context[:current_org].id})
                   .preload(:payable)
  }

  # Options
  option :type,         type: types.String
  option :payable_type, type: types.String
  option :payable_id,   type: types.ID
  option :account_id,   type: types.ID
  option(:organization_id, type: types.ID) {|scope| scope }

  option :entry_type, type: types.String do |scope, value|
    scope.entry_type(value) unless value.blank?
  end

  option :aasm_state, type: types.String do |scope, value|
    scope.joins(:entry).where(entries: {aasm_state: value}) unless value.blank?
  end

  option :start_date, type: types.String do |scope, value|
    scope.dated_after(value.to_date) unless value.blank?
  end
  option :end_date, type: types.String do |scope, value|
    scope.dated_before(value.to_date) unless value.blank?
  end
  option :min_amount, type: types.String do |scope, value|
    scope.by_min_amount(value) unless value.blank?
  end
  option :max_amount, type: types.String do |scope, value|
    scope.by_max_amount(value.gsub(/\./, "")) unless value.blank?
  end

  option :memo, type: types.String do |scope, value|
    scope.by_partial_memo(value.gsub(/\./, "")) unless value.blank?
  end

  option :draft, type: types.String do |scope, value|
    scope.draft if value == true
  end

  option :submitted, type: types.String do |scope, value|
    scope.submitted if value == true
  end

  option :approved, type: types.String do |scope, value|
    scope.approved if value == true
  end

  option :credits, type: types.String do |scope, value|
    scope.credits unless value.blank?
  end

  option :debits, type: types.String do |scope, value|
    scope.debits unless value.blank?
  end

  option :vendor_id, type: types.ID do |scope, value|
    scope.by_vendor(value) unless value.blank?
  end

  option :customer_id, type: types.ID do |scope, value|
    scope.by_customer(value) unless value.blank?
  end

  option :account, type: Types::AccountCodeInputObject do |scope, value|
    unless value.blank?

      [:fund, :function, :resource, :object, :location, :goal, :year].inject(scope) do |current_scope, account_elem|
        filter_val = value[:"#{account_elem}Code"] || value[:"#{account_elem}_code"] || value[:"#{account_elem}"]

        unless filter_val
          current_scope
        else
          # Check for range or list
          if filter_val.is_a?(String) && filter_val =~ /^\d[\d,.-]*\d$/
            filter_val = filter_val.split(",").map(&:strip)
            filter_val = filter_val.map {|val| (val =~ /\.\.\.|-/) ? Range.new(*val.split(/\.\.\.|-/).map(&:to_i)).map(&:to_s) : val}
            filter_val.flatten!
            filter_val.uniq!
          end

          current_scope.by_code(account_elem, filter_val)
        end
      end
    end
  end
end
