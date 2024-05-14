# Find a record of model_type by id

class Functions::FindReport < GraphQL::Function
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
    funds = ctx[:current_user].accessible_funds(ctx[:current_org]&.id).map {|fund| fund.code }.sort

    @report = @model_class.where(
      organization: ctx[:current_org],
      start_date: 1.month.ago,
      end_date: Date.today.end_of_month
    ).where("data->>'fund_code' = ?", funds.join(', ')).first

    if @report.nil?
      @report = @model_class.new
      @report.assign_attributes(
        organization: ctx[:current_org],
        start_date: 1.month.ago,
        end_date: Date.today.end_of_month
      )

      if @model_class.method_defined? :account_search_params
        @report.account_search_params = { fund_code: funds }
      else
        @report.funds = funds
      end

      @report.run_report(true)
    end

    @report
  end
end
