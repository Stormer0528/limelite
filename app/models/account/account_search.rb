# Note search_object does not autoload like a normal ruby class
require 'search_object'

class Account::AccountSearch
  include SearchObject.module

  scope { @current_org.accounts.includes(:account_function, :account_fund, :account_goal, :account_location, :account_object, :account_resource, :account_year, :budgets) }

  # Options
  option(:name)        { |scope, value| scope.by_name(value) unless value.blank? }
  option(:description) { |scope, value| scope.where("description ILIKE CONCAT('%',?,'%')", value) unless value.blank? }
  option(:cash_accounts) { |scope, value| scope.cash_accounts unless value.blank? }

  # Find by id
  option(:account_function_id) { |scope, value| scope.where account_function_id: value unless value.blank? }
  option(:account_fund_id)     { |scope, value| scope.where account_fund_id:     value unless value.blank? }
  option(:account_goal_id)     { |scope, value| scope.where account_goal_id:     value unless value.blank? }
  option(:account_location_id) { |scope, value| scope.where account_location_id: value unless value.blank? }
  option(:account_object_id)   { |scope, value| scope.where account_object_id:   value unless value.blank? }
  option(:account_resource_id) { |scope, value| scope.where account_resource_id: value unless value.blank? }
  option(:account_year_id)     { |scope, value| scope.where account_year_id:     value unless value.blank? }

  # Find by code
  option(:functionCode) { |scope, value| scope.by_partial_code(:function, value) unless value.blank? }
  option(:fundCode)     { |scope, value| scope.by_partial_code(:fund,     value) unless value.blank? }
  option(:goalCode)     { |scope, value| scope.by_partial_code(:goal,     value) unless value.blank? }
  option(:locationCode) { |scope, value| scope.by_partial_code(:location, value) unless value.blank? }
  option(:objectCode)   { |scope, value| scope.by_partial_code(:object,   value) unless value.blank? }
  option(:resourceCode) { |scope, value| scope.by_partial_code(:resource, value) unless value.blank? }
  option(:yearCode)     { |scope, value| scope.by_partial_code(:year,     value) unless value.blank? }

  option(:function_code) { |scope, value| scope.by_code(:function, value) unless value.blank? }
  option(:fund_code)     { |scope, value| scope.by_code(:fund,     value) unless value.blank? }
  option(:goal_code)     { |scope, value| scope.by_code(:goal,     value) unless value.blank? }
  option(:location_code) { |scope, value| scope.by_code(:location, value) unless value.blank? }
  option(:object_code)   { |scope, value| scope.by_code(:object,   value) unless value.blank? }
  option(:resource_code) { |scope, value| scope.by_code(:resource, value) unless value.blank? }
  option(:year_code)     { |scope, value| scope.by_code(:year,     value) unless value.blank? }
end
