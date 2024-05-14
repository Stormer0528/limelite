# Find a record of model_type by id

class Functions::FindAReport < GraphQL::Function
  # Define `initialize` to store field-level options, eg
  #
  #     field :myField, function: Functions::FindRecord.new(type: MyType)
  #
  attr_reader :type

  def initialize(model_class:, type:)
    @model_class = model_class
    @type = type
  end

  # Resolve function:
  def call(_obj, _args, ctx)
    @report = ctx[:current_org].send(@model_class) || ctx[:current_org].send("build_#{@model_class}", start_date: 1.year.ago, end_date: Date.today, organization_id: ctx[:current_org].id)
  end
end
