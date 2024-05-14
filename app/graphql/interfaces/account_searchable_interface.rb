module Interfaces::AccountSearchableInterface
  include Types::BaseInterface
  description "Elements for types with the entry search bar"

  field :account_function,  [Types::Account::AccountFunction, null: true], null: true
  field :account_fund,      [Types::Account::AccountFund, null: true],     null: true
  field :account_goal,      [Types::Account::AccountGoal, null: true],     null: true
  field :account_location,  [Types::Account::AccountLocation, null: true], null: true
  field :account_object,    [Types::Account::AccountObject, null: true],   null: true
  field :account_resource,  [Types::Account::AccountResource, null: true], null: true
  field :account_year,      [Types::Account::AccountYear, null: true],     null: true

  def account_function
    context[:current_org].account_functions.where(code: object.account_search_params&.dig("function_code"))
  end

  def account_fund
    context[:current_org].account_funds.where(code: object.account_search_params&.dig("fund_code"))
  end

  def account_goal
    context[:current_org].account_goals.where(code: object.account_search_params&.dig("goal_code"))
  end

  def account_location
    context[:current_org].account_locations.where(code: object.account_search_params&.dig("location_code"))
  end

  def account_object
    context[:current_org].account_objects.where(code: object.account_search_params&.dig("object_code"))
  end

  def account_resource
    context[:current_org].account_resources.where(code: object.account_search_params&.dig("resource_code"))
  end

  def account_year
    context[:current_org].account_years.where(code: object.account_search_params&.dig("year_code"))
  end
end
