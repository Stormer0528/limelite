class Resolvers::EntryResolver < Resolvers::BaseSearchResolver
  # include SearchObject.module(:graphql)

  type types[Types::EntryType]
  description "Find and filter entries"

  scope { context[:current_org] ? context[:current_org].entries.includes(entry_items: [:account, account: [:account_fund, :account_resource, :account_year, :account_goal, :account_function, :account_object, :account_location]]) : Entry.all }

  # Options
  option :aasm_state, type: types.String
  option :entry_type, type: types.String
  option :journalable_type, type: types.String
  option :journalable_id, type: types.ID

  option :limit, type: types.Int do |scope, value|
    scope.limit(value) unless value.blank?
  end
  option :offset, type: types.Int do |scope, value|
    scope.offset(value) unless value.blank?
  end
  option :start_date, type: types.String do |scope, value|
    scope.dated_after(Date.parse(value)) unless value.blank?
  end
  option :end_date, type: types.String do |scope, value|
    scope.dated_before(Date.parse(value)) unless value.blank?
  end
  option :min_amount, type: types.String do |scope, value|
    scope.by_min_amount(value.gsub(/\./, "")) unless value.blank?
  end
  option :max_amount, type: types.String do |scope, value|
    scope.by_max_amount(value.gsub(/\./, "")) unless value.blank?
  end
  option :vendor_id, type: types.ID do |scope, value|
    scope.by_vendor(value) unless value.blank?
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
            filter_val = filter_val.split(",")
            filter_val = filter_val.map {|val| (val =~ /\.\.\.|-/) ? Range.new(*val.split(/\.\.\.|-/).map(&:to_i)) : val}
          end

          current_scope.by_code(account_elem, filter_val)
        end
      end
    end
  end
end
