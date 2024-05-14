require 'search_object'

class Entry::EntrySearch
  include SearchObject.module

  scope { Entry.all }

  # Options
  option :aasm_state
  option :entry_type
  option :journalable_type
  option :journalable_id
  option :organization_id

  option :start_date do |scope, value|
    scope.dated_after(value&.to_date) unless value.empty?
  end

  option :end_date do |scope, value|
    scope.dated_before(value&.to_date) unless value.empty?
  end

  option :min_amount do |scope, value|
    scope.by_min_amount(value) unless value.blank?
  end

  option :max_amount do |scope, value|
    scope.by_max_amount(value) unless value.blank?
  end

  option :vendor_id do |scope, value|
    scope.by_vendor(value) unless value.blank?
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
            filter_val = filter_val.split(",")
            filter_val = filter_val.map {|val| (val =~ /\.\.\.|-/) ? Range.new(*val.split(/\.\.\.|-/).map(&:to_i)) : val}
          end

          current_scope.by_code(account_elem, filter_val)
        end
      end
    end
  end
end
