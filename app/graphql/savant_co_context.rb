class SavantCoContext < GraphQL::Query::Context
  # Shorthand to get the current user
  def current_org
    self[:current_org]
  end

  def current_user
    self[:current_user]
  end

  def current_user_group
    self[:current_user_group]
  end
end
