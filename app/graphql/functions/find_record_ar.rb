# Find a record of model_type by id

class Functions::FindRecordAr < GraphQL::Function
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
    @model_class.find_by id: args[:id], organization_id: ctx[:current_org]&.id
  end
end
