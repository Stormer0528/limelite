# Find a record of model_type by id

class Functions::ListAccountFunds < GraphQL::Function
  attr_reader :type

  def initialize(model_class:, type:)
    @model_class = model_class
    @type = type
  end

  # Resolve function:
  def call(_obj, _args, ctx)
    current_user = ctx[:current_user]
    current_user.accessible_funds(ctx[:current_org]&.id)
  end
end
