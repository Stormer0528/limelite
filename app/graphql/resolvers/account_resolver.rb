class Resolvers::AccountResolver < Resolvers::BaseSearchResolver
  include SearchObject.module(:graphql)

  type types[Types::AccountType]
  description "Find Accounts account properties"

  scope {
    context[:current_org].accounts.includes(
      :account_function,
      :account_fund,
      :account_goal,
      :account_location,
      :account_object,
      :account_resource,
      :account_year,
      :budgets
    ).where(
      account_fund: context[:current_user].accessible_funds(context[:current_org]&.id)
    )
  }

  # Options
  option(:name,          type: types.String) {|scope, value| scope.by_name(value) unless value.blank? }
  option(:description,   type: types.String) {|scope, value|
    scope.where("description ILIKE CONCAT('%',?,'%')", value) unless value.blank?
  }
  option(:timestamp,     type: types.String) {|scope| scope }
  option(:cash_accounts, type: types.Boolean) {|scope, value| scope.cash_accounts unless value.blank? }

  # Find by id
  option(:account_function_id, type: types.ID) {|scope, value|
    scope.where account_function_id: value unless value.blank?
  }
  option(:account_fund_id, type: types.ID) {|scope, value|
    scope.where account_fund_id: value unless value.blank?
  }
  option(:account_goal_id, type: types.ID) {|scope, value|
    scope.where account_goal_id: value unless value.blank?
  }
  option(:account_location_id, type: types.ID) {|scope, value|
    scope.where account_location_id: value unless value.blank?
  }
  option(:account_object_id, type: types.ID) {|scope, value|
    scope.where account_object_id: value unless value.blank?
  }
  option(:account_resource_id, type: types.ID) {|scope, value|
    scope.where account_resource_id: value unless value.blank?
  }
  option(:account_year_id, type: types.ID) {|scope, value|
    scope.where account_year_id: value unless value.blank?
  }

  option(:scoped, type: types.Boolean) {|scope, value|
    scope unless value
    if @context[:auth_ctx]&.organization_assignment&.role == "Call Requestor"
      scope.where(id: @context[:current_user]&.department&.account_id)
    else
      scope
    end
  }

  # Find by code
  option(:function_code, type: types.String) {|scope, value|
    scope.by_partial_code(:function, value) unless value.blank?
  }
  option(:fund_code, type: types.String) {|scope, value|
    scope.by_partial_code(:fund, value) unless value.blank?
  }
  option(:goal_code, type: types.String) {|scope, value|
    scope.by_partial_code(:goal, value) unless value.blank?
  }
  option(:location_code, type: types.String) {|scope, value|
    scope.by_partial_code(:location, value) unless value.blank?
  }
  option(:object_code, type: types.String) {|scope, value|
    scope.by_partial_code(:object, value) unless value.blank?
  }
  option(:resource_code, type: types.String) {|scope, value|
    scope.by_partial_code(:resource, value) unless value.blank?
  }
  option(:year_code, type: types.String) {|scope, value|
    scope.by_partial_code(:year, value) unless value.blank?
  }
end
