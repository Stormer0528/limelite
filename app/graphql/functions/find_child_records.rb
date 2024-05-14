# Find a record of model_type by id

class Functions::FindChildRecords < GraphQL::Function
  # Define `initialize` to store field-level options, eg
  #
  #     field :myField, function: Functions::FindRecord.new(type: MyType)
  #
  attr_reader :type

  def initialize(model_class:, assocation:, type:)
    @model_class = model_class
    @type = type
    @assocation = assocation
  end

  # add arguments by type:
  argument :id, !types.ID

  # Resolve function:
  def call(_obj, args, _ctx)
    RecordLoader.for(@model_class).load(args[:id]).then do |model|
      model.send(@assocation)
    end
  end
end
