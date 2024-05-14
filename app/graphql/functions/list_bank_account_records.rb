# Find a record of model_type by id

class Functions::ListBankAccountRecords < GraphQL::Function
  # Define `initialize` to store field-level options, eg
  #
  #     field :myField, function: Functions::FindRecord.new(type: MyType)
  #
  attr_reader :type

  def initialize(model_class:, type:)
    @model_class = model_class
    @type = type
  end

  argument :bank_account_id, !types.ID

  # Resolve function:
  def call(_obj, args, _ctx)
    BankAccount.find(args[:bank_account_id]).call(@model_class.to_s.pluralize)
    @model_class.all
  end
end
