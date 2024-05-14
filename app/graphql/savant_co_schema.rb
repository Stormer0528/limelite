class SavantCoSchema < GraphQL::Schema
  # context_class SavantCoContext
  # Set up the graphql-batch gem
  use GraphQL::Batch
  use GraphQL::Guard.new

  max_depth 15
  max_complexity 300
  default_max_page_size 100

  lazy_resolve(Promise, :sync)

  query Types::QueryType
  mutation Types::MutationType
  orphan_types [Types::CreditCardChargeType, Types::CreditCardPaymentType]

  # Required here even implemented in Union
  def self.resolve_type(_type, obj, _ctx)
    case obj[:type]
    when "check"
      Types::CheckType
    when "BankAccount::Check"
      Types::CheckType
    when "deposit"
      Types::DepositType
    when "BankAccount::Deposit"
      Types::DepositType
    when "account_transfer"
      Types::AccountTransferType
    when "BankAccount::AccountTransfer"
      Types::AccountTransferType
    when "Invoice"
      Types::Invoice
    when "BankAccount::Item"
      Types::BankAccountItem
    when "BatchUpload"
      Types::BatchUploadType
    when "Payment"
      Types::Payment
    end
  end
end

GraphQL::Errors.configure(SavantCoSchema) do
  rescue_from ActiveRecord::RecordNotFound do |_exception|
    # -- ISSUE: context not defined
    GraphQL::ExecutionError.new("RecordNotFound")
    # context.add_error("RecordNotFound") if context
    nil
  end

  rescue_from ActiveRecord::RecordInvalid do |exception|
    GraphQL::ExecutionError.new(exception.record.errors.full_messages.join("\n"))
  end

  # uses Module to handle several similar errors with single rescue_from
  # rescue_from MyNetworkErrors do |_|
  #   GraphQL::ExecutionError.new("Don't mind, just retry the mutation")
  # end

  # rescue_from StandardError do |exception|
  #   GraphQL::ExecutionError.new("Please try to execute the query for this field later")
  # end
  #
  # rescue_from CustomError do |exception, object, arguments, context|
  #   error = GraphQL::ExecutionError.new("Error found!")
  #   firstError.path = context.path + ["myError"]
  #   context.add_error(firstError)
  # end
end
