# Find a record of model_type by id

class Functions::DestroyRecord < GraphQL::Function
  # Define `initialize` to store field-level options, eg
  #
  #     field :myField, function: Functions::FindRecord.new(type: MyType)
  #
  attr_reader :type

  def initialize(model_class:, type:)
    @model_class = model_class
    @type = type
  end

  # add arguments by type:
  argument :id, !types.ID

  # Resolve function:
  def call(_obj, args, ctx)
    record = @model_class.find args[:id]
    # Check if user can destroy
    auth_ctx = AuthorizationContext.new ctx[:current_user], ctx[:current_org]
    policy = @model_class.policy_class.new auth_ctx, record
    record.destroy if policy.destroy?
    record
  end
end
