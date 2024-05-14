# Find a record of model_type by id

class Functions::FindFriendlyRecord < GraphQL::Function
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
  argument :slug, !types.String

  # Resolve function:
  def call(_obj, args, ctx)
    record = @model_class.find_by(slug: args[:slug], organization_id: ctx[:current_org]&.id)

    # Check Auth
    return ActiveRecord::RecordNotFound if record.nil?
    raise GraphQL::ExecutionError, "You are not authorized to view #{type.graphql_name}" unless Pundit.policy(ctx[:auth_ctx], record).show?

    record
  end
end
