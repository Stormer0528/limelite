require 'search_object'

class Entry::EntryItemSearch
  include SearchObject.module

  scope { EntryItem.all }

  # Options
  option :type
  option :payable_type
  option :payable_id
  option :account_id

  option :organization_id do |scope, value|
    scope.by_org(value) unless value.blank?
  end

  option :entry_type do |scope, value|
    scope.entry_type(value) unless value.empty?
  end

  option :aasm_state do |scope, value|
    scope.joins(:entry).where(entries: {aasm_state: value}) unless value.blank?
  end

  option :start_date do |scope, value|
    scope.dated_after(value&.to_date) unless value.blank?
  end

  option :end_date do |scope, value|
    scope.dated_before(value&.to_date) unless value.blank?
  end

  option :vendor_id do |scope, value|
    scope.by_vendor(value) unless value.blank?
  end

  option :start_date_with_beginning_balance do |scope, value|
    unless value.blank?
      scope.joins(:entry).where("(entries.entry_type = ? AND entries.date < ?) OR entries.date >= ?", "Beginning Balance", value, value)
    end
  end

  option :min_amount do |scope, value|
    scope.by_min_amount(value.gsub(/\./, "")) unless value.blank?
  end

  option :max_amount do |scope, value|
    scope.by_max_amount(value.gsub(/\./, "")) unless value.blank?
  end

  option :memo do |scope, value|
    scope.by_partial_memo(value) unless value.blank?
  end

  option :draft do |scope, value|
    scope.draft if value == true
  end

  option :submitted do |scope, value|
    scope.submitted if value == true
  end

  option :approved do |scope, value|
    scope.approved if value == true
  end

  option :credits do |scope, value|
    scope.credits unless value.blank?
  end

  option :debits do |scope, value|
    scope.debits unless value.blank?
  end

  option :account do |scope, value|
    unless value.blank?
      [:fund, :function, :resource, :object, :location, :goal, :year].inject(scope) do |current_scope, account_elem|
        filter_val = value[:"#{account_elem}Code"] || value[:"#{account_elem}_code"] || value[:"#{account_elem}"]
        unless filter_val
          current_scope
        else
          # Check for range or list
          if filter_val.is_a?(String) && filter_val =~ /^\d[\d,.-]*\d$/
            filter_val = filter_val.split(",").map(&:strip)
            filter_val = filter_val.map {|val| (val =~ /\.\.\.|-/) ? Range.new(*val.split(/\.\.\.|-/).map(&:to_i)).map(&:to_s): val}
            filter_val.flatten!
            filter_val.uniq!
          end
          current_scope.by_code(account_elem, filter_val)
        end
      end
    end
  end
end
