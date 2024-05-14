Types::QueryType = GraphQL::ObjectType.define do
  name "Query"

  field :organizationSearch, types[Types::OrganizationType], function: Resolvers::OrganizationResolver
  field :currentOrg, Types::OrganizationType do
    resolve ->(_obj, _args, context) {
      context[:current_org]
    }
  end

  field :filestack, Types::FilestackType do
    resolve ->(_obj, _args, _context) {
      {}
    }
  end

  field :dashboard, ::Types::Report::DashboardType do
    argument :fundCode, types.String
    argument :startDate, types.String
    argument :endDate, types.String

    resolve ->(_obj, args, ctx) {
      funds = Types::AccountCodeInputObject.intersect_funds(
        ctx[:current_user].accessible_funds(ctx[:current_org]&.id).map {|fund| fund.code }.sort,
        Types::AccountCodeInputObject.parse_account_funds(args[:fundCode])
      )

      dashboard = Report::Dashboard.where(
        organization: ctx[:current_org],
        start_date: args[:startDate],
        end_date: args[:endDate],
        fund_code: funds.join(', ')
      ).first

      if dashboard.nil?
        dashboard = Report::Dashboard.new

        dashboard.assign_attributes(
          organization: ctx[:current_org],
          start_date: args[:startDate],
          end_date: args[:endDate],
          fund_code: funds.join(', ')
        )

        dashboard.run_report(true)
      end

      return dashboard
    }
  end

  field :batchUpload, function: Functions::FindRecordAr.new(model_class: BatchUpload, type: Types::BatchUploadType)
  field :batchUploads, types[Types::BatchUploadType], function: Resolvers::BatchUploadResolver

  # Account Elements
  #-----------------------------------------------------------------------------
  field :account, function: Functions::FindRecordAr.new(model_class: Account, type: Types::AccountType)
  field :accountSearch, types[Types::AccountType], function: Resolvers::AccountResolver
  connection :accountSearchConnection, Types::AccountType.connection_type, function: Resolvers::AccountResolver,
                                                                           max_page_size: 2500

  field :accountByNumber, Types::AccountType do
    description "returns account with given element codes"
    argument :functionCode, types.String
    argument :fundCode,     types.String
    argument :goalCode,     types.String
    argument :locationCode, types.String
    argument :objectCode,   types.String
    argument :resourceCode, types.String
    argument :yearCode,     types.String

    resolve ->(_obj, args, context) {
      return false unless context[:current_org]

      Account.by_partial_number(
        fund: args[:fundCode],
        resource: args[:resourceCode],
        year: args[:yearCode],
        goal: args[:goalCode],
        object: args[:objectCode],
        function: args[:functionCode],
        location: args[:locationCode],
        organization_id: context[:current_org].id
      )
    }
  end

  field :accounts, types[Types::AccountType] do
    description "Accounts for current Organization"

    argument :function_code, types.ID
    argument :fund_code,     types.ID
    argument :goal_code,     types.ID
    argument :location_code, types.ID
    argument :object_code,   types.ID
    argument :resource_code, types.ID
    argument :year_id, types.ID

    resolve ->(_obj, args, context) {
      policy = Pundit.policy(context[:auth_ctx], Account)
      return [] unless policy.index?

      begin
        accounts = Pundit.policy_scope(context[:auth_ctx], Account).where(organization: context[:current_org])
                         .includes(:account_function, :account_fund, :account_goal, :account_location, :account_object, :account_resource, :account_year, :budgets)
        if args.to_h.empty?
          accounts
        else
          accounts.find_by_codes(args.to_h, context[:current_org]) || []
        end
      rescue StandardError => e
        # handle all other errors
        GraphQL::ExecutionError.new("Unexpected error: #{e.message}")
      end
    }
  end

  field :accountFunds, types[Types::Account::AccountFund] do
    description "Account funds for specific organization"

    argument :organizationId, types.ID

    resolve ->(_obj, args, ctx) {
      if ctx[:current_org]
        return ctx[:current_org].account_funds
      end

      AccountFund.all
    }
  end

  field :accountFundUsers, types[Types::UserType] do
    description "Get list of users who are associated with a fund"

    argument :organizationId, types.ID
    argument :accountFundId, types.ID

    resolve ->(_obj, args, ctx) {
      if ctx[:current_org]
        fund = ctx[:current_org].account_funds.find(args[:accountFundId])

        if fund.nil?
          return nil
        else
          return fund.users
        end
      end

      return nil
    }
  end

  # Account Elements
  #-----------------------------------------------------------------------------
  field :account_functions,
        function: Functions::ListRecords.new(model_class: AccountFunction, type: types[Types::Account::AccountFunction])
  field :account_funds,
        function: Functions::ListAccountFunds.new(model_class: AccountFund, type: types[Types::Account::AccountFund])
  field :account_goals,
        function: Functions::ListRecords.new(model_class: AccountGoal, type: types[Types::Account::AccountGoal])
  field :account_locations,
        function: Functions::ListRecords.new(model_class: AccountLocation, type: types[Types::Account::AccountLocation])
  field :account_objects,
        function: Functions::ListRecords.new(model_class: AccountObject, type: types[Types::Account::AccountObject])
  field :account_resources,
        function: Functions::ListRecords.new(model_class: AccountResource, type: types[Types::Account::AccountResource])
  field :account_years,
        function: Functions::ListRecords.new(model_class: AccountYear, type: types[Types::Account::AccountYear])
  field :cashAccounts, types[Types::Account::AccountObject] do
    description "Account Objects connected to Bank Accounts"
    resolve ->(_obj, _args, context) {
      context[:current_org].account_objects.with_bank_account
    }
  end

  # By Code
  field :accountFunctionByCode,
        function: Functions::FindByCode.new(model_class:  AccountFunction, type: Types::Account::AccountFunction)
  field :accountFundByCode,
        function: Functions::FindByCode.new(model_class:  AccountFund, type: Types::Account::AccountFund)
  field :accountGoalByCode,
        function: Functions::FindByCode.new(model_class:  AccountGoal, type: Types::Account::AccountGoal)
  field :accountLocationByCode,
        function: Functions::FindByCode.new(model_class:  AccountLocation, type: Types::Account::AccountLocation)
  field :accountObjectByCode,
        function: Functions::FindByCode.new(model_class:  AccountObject, type: Types::Account::AccountObject)
  field :accountResourceByCode,
        function: Functions::FindByCode.new(model_class:  AccountResource, type: Types::Account::AccountResource)
  field :accountYearByCode,
        function: Functions::FindByCode.new(model_class:  AccountYear, type: Types::Account::AccountYear)

  # Entries
  #-----------------------------------------------------------------------------
  field :entry,   function: Functions::FindRecord.new(model_class:  Entry, type: Types::EntryType)
  field :entries, function: Functions::ListRecords.new(model_class: Entry, type: types[Types::EntryType])
  field :entrySearch, types[Types::EntryType], function: Resolvers::EntryResolver
  connection :entrySearchConnection, Types::EntryType.connection_type, function: Resolvers::EntryResolver,
                                                                       max_page_size: 500
  connection :entryItemsSearchConnection, Types::EntryItemType.connection_type,
             function: Resolvers::EntryItemResolver, max_page_size: 500

  # Bank Accounts
  #-----------------------------------------------------------------------------
  field :bank_account,
        function: Functions::FindFriendlyRecord.new(model_class: BankAccount, type: Types::BankAccountType)
  field :bank_accounts,
        function: Functions::ListRecords.new(model_class: BankAccount, type: types[Types::BankAccountType])
  field :bankAccounts,
        function: Functions::ListRecords.new(model_class: BankAccount, type: types[Types::BankAccountType])
  field :check,   function: Functions::FindRecord.new(model_class: BankAccount::Check,   type: Types::CheckType)
  field :deposit, function: Functions::FindRecord.new(model_class: BankAccount::Deposit, type: Types::DepositType)
  field :account_transfer,
        function: Functions::FindRecord.new(model_class: BankAccount::AccountTransfer, type: Types::AccountTransferType)

  field :lastStatementBalance, types.String do
    argument :id, !types.ID
    argument :before_date, types.String
    argument :statementable_type, !types.String

    resolve ->(_obj, args, context) {
      satementable_type = args["statementable_type"]
      context[:current_org].send(satementable_type).find(args["id"]).last_statement_balance(args["before_date"])
    }
  end

  field :lastStatement, Types::StatementType do
    argument :slug, !types.String
    argument :before_date, types.String
    argument :statementable_type, !types.String

    resolve ->(_obj, args, context) {
      satementable_type = args["statementable_type"]
      context[:current_org].send(satementable_type).friendly.find(args["slug"]).last_statement(args["before_date"])
    }
  end
  field :bankItemSearch, types[Unions::BankItemUnion], function: Resolvers::BankItemResolver
  connection :bankItemConnection, Unions::BankItemUnion.connection_type, function: Resolvers::BankItemResolver,
                                                                         max_page_size: 500

  # Statements
  #-----------------------------------------------------------------------------
  field :statement, function: Functions::FindRecordAr.new(model_class: Statement, type: Types::StatementType)
  field :statementSearch, types[Types::StatementType], function: Resolvers::BankStatementResolver
  field :statementVersion, Types::StatementVersionType do
    argument :id, !types.ID
    argument :versionId, !types.ID

    resolve ->(_obj, args, _context) {
      statement = Statement.find(args[:id])

      statement.revision(args[:versionId]&.to_i)
    }
  end

  # Credit Cards
  #-----------------------------------------------------------------------------
  field :creditCard,  function: Functions::FindFriendlyRecord.new(model_class: CreditCard, type: Types::CreditCardType)
  field :creditCards, function: Functions::ListRecords.new(model_class: CreditCard,  type: types[Types::CreditCardType])
  field :creditCardItemSearch, types[Interfaces::CreditCardItemInterface], function: Resolvers::CreditCardItemResolver
  connection :creditCardItemConnection, Interfaces::CreditCardItemInterface.connection_type,
             function: Resolvers::CreditCardItemResolver, max_page_size: 500

  field :creditCardPayment, Types::CreditCardPaymentType do
    argument :creditCardSlug, !types.String
    argument :paymentId, !types.ID

    resolve ->(_obj, args, context) {
      @cc = context[:current_org].credit_cards.friendly.find(args[:creditCardSlug])
      @cc.payments.find(args[:paymentId])
    }
  end

  field :creditCardCharge, Types::CreditCardPaymentType do
    argument :creditCardSlug, !types.String
    argument :chargeId, !types.ID

    resolve ->(_obj, args, context) {
      @cc = context[:current_org].credit_cards.friendly.find(args[:creditCardSlug])
      @cc.charges.find(args[:chargeId])
    }
  end

  # Address
  #-----------------------------------------------------------------------------
  field :addressSearch, types[Types::AddressType], function: Resolvers::AddressResolver
  field :address, Types::AddressType do
    argument :id, types.ID
    resolve ->(_obj, args, _context) {
      return nil unless args["id"]&.present?

      address = Address.find(args["id"])
      address
    }
  end

  field :printerSettings, types[Types::PrinterSettingType] do
    resolve ->(_obj, _args, ctx) {
      return ctx[:current_org].printer_settings.uniq
    }
  end

  field :validateCheckNumbers, Types::BaseResponse do
    argument :numbers, !types[types.String]
    argument :bankAccountId, !types.ID

    resolve  ->(_obj, args, ctx) {
      @bankAccount = ctx[:current_org].bank_accounts.find args["bankAccountId"]
      errors = []
      args["numbers"].each do |number|
        next unless @bankAccount.checks.where(
          number: number,
          aasm_state: ["printed", "voided"],
          paper_check: true
        ).any?

        errors.push "Check Number #{number} is already taken"
      end

      return {success: errors.length.zero?, error_messages: errors}
    }
  end

  # Vendors
  #-----------------------------------------------------------------------------
  field :vendors, function: Functions::ListRecords.new(model_class: Vendor,  type: types[Types::Vendor])
  field :vendor,  function: Functions::FindRecordAr.new(model_class: Vendor, type: Types::Vendor)
  field :vendorBySlug, function: Functions::FindFriendlyRecord.new(model_class: Vendor, type: Types::Vendor)

  field :vendorSearch, types[Types::Vendor], function: Resolvers::VendorResolver

  # Users
  #-----------------------------------------------------------------------------
  field :adminUsers, types[Types::UserType], function: Resolvers::AdminUserResolver
  field :users, types[Types::UserType], function: Resolvers::UserResolver
  field :user, function: Functions::FindRecordAr.new(model_class: User, type: Types::UserType)
  field :currentUser, Types::UserType do
    resolve ->(_obj, _args, ctx) {
      ctx[:current_user]
    }
  end

  connection :authableItemConnection, Unions::AuthorizableUnion.connection_type, function: Resolvers::AuthorizableItemResolver

  field :userGroup, Types::UserGroupType do
    argument :id, types.ID
    argument :organizationId, types.ID

    resolve ->(_obj, args, ctx) {
      begin
        ctx[:current_org].user_groups.find(args[:id])
      rescue StandardError
        {}
      end
    }
  end

  field :userGroups, Types::UserGroupType do
    argument :organizationId, types.ID
    resolve ->(_obj, args, ctx) {
      org = args[:organizationId] ? Organization.find(args[:organizationId]) : ctx[:current_org]
      org.user_groups.unarchived.find_by(parent_id: nil)
    }
  end

  field :userGroupList, types[Types::UserGroupType] do
    argument :organizationId, types.ID
    resolve ->(_obj, args, ctx) {
      org = args[:organizationId] ? Organization.find(args[:organizationId]) : ctx[:current_org]
      org.user_groups.unarchived.order(:name)
    }
  end

  # Customers
  #-----------------------------------------------------------------------------
  field :customers, function: Functions::ListRecords.new(model_class: Customer,  type: types[Types::CustomerType])
  field :customer,  function: Functions::FindRecordAr.new(model_class: Customer, type: Types::CustomerType)
  field :customerBySlug, function: Functions::FindFriendlyRecord.new(model_class: Customer, type: Types::CustomerType)
  field :customerSearch, types[Types::CustomerType], function: Resolvers::CustomerResolver

  # Invoices
  #-----------------------------------------------------------------------------
  field :invoiceSearch, types[Types::InvoiceType], function: Resolvers::InvoiceResolver
  field :invoice, function: Functions::FindRecordAr.new(model_class: Invoice, type: Types::InvoiceType)

  # Purchase Orders
  field :purchaseOrder,
        function: Functions::FindRecordAr.new(model_class: PurchaseOrder, type: Types::PurchaseOrderType)
  field :purchaseOrderSearch, types[Types::PurchaseOrderType], function: Resolvers::PurchaseOrderResolver
  connection :purchaseOrderSearchConnection, Types::PurchaseOrderType.connection_type,
             function: Resolvers::PurchaseOrderResolver
  field :purchaseOrderBySlug, Types::PurchaseOrderType do
    argument :slug, !types.String
    argument :vendorSlug, !types.String

    resolve ->(_object, args, ctx) {
      vendor = Vendor.find_by(slug: args[:vendorSlug], organization_id: ctx[:current_org]&.id)

      return {} unless vendor

      vendor.purchase_orders.find_by(slug: args[:slug])
    }
  end

  # File Uploads
  field :fileUploadSearch, types[Types::FileUploadType], function: Resolvers::FileUploadResolver
  connection :fileUploadSearchConnection, Types::FileUploadType.connection_type, function: Resolvers::FileUploadResolver

  # Approval Logs
  connection :stateChangeLogSearchConnection, Types::StateChangeLogType.connection_type, function: Resolvers::StateChangeLogResolver

  # Fiscal Year
  #-----------------------------------------------------------------------------
  field :fiscalYear, types.Int do
    resolve ->(_obj, _args, context) {
      context[:fiscal_year]
    }
  end

  field :permissions, Types::PermissionsType do
    argument :model_class, types.String

    resolve ->(_object, args, context) {
      begin
        policy = Pundit.policy(context[:auth_ctx], args[:model_class].safe_constantize || args[:model_class].to_sym)
        response = {}
        [
          :index,
          :create,
          :edit,
          :view,
          :show,
          :update,
          :destroy,
          :delete,
          :save_draft,
          :send_for_approval,
          :reverse_approval,
          :approve,
          :deny,
          :void,
          :print
        ].each do |method_name|
          perm_name = case method_name
                      when :view
                        :show?
                      when :delete
                        :destroy?
                      else
                        :"#{method_name}?"
                      end
          response[method_name] = policy.respond_to?(perm_name) && policy.send(perm_name)
        end
        response
      rescue NameError
        response
      end
    }
  end

  # Reports
  #-----------------------------------------------------------------------------
  field :ap_aging_report,
        function: Functions::FindReport.new(model_class: Report::ApAgingReport, type: ::Types::Report::ApAgingReport)
  field :ar_aging_report,
        function: Functions::FindReport.new(model_class: Report::ArAgingReport, type: Types::Report::ArAgingReport)
  field :balanceSheet,
        function: Functions::FindReport.new(model_class: Report::BalanceSheet, type: Types::Report::BalanceSheet)
  field :balanceSheetByMonth,
        function: Functions::FindReport.new(model_class: Report::BalanceSheetByMonth,
                                            type: Types::Report::BalanceSheetByMonthReport)

  field :comparativeBalanceSheet,
        function: Functions::FindReport.new(model_class: Report::ComparativeBalanceSheet,
                                            type: Types::Report::ComparativeBalanceSheet)

  field :balanceSheetByResource,
        function: Functions::FindReport.new(model_class: Report::BalanceSheetByResource,
                                            type: Types::Report::BalanceSheetByResourceReport)
  field :cashFlowReport,
        function: Functions::FindReport.new(model_class: Report::CashFlowReport, type: Types::Report::CashFlowReport)
  field :monthly_cash_flow_report,
        function: Functions::FindReport.new(model_class: Report::MonthlyCashFlowReport,
                                            type: Types::Report::MonthlyCashFlowReport)
  field :monthly_profit_and_loss_statement,
        function: Functions::FindReport.new(model_class: Report::MonthlyProfitLossStatement,
                                            type: Types::Report::MonthlyProfitAndLossStatement)
  field :profit_and_loss_by_resource_report,
        function: Functions::FindReport.new(model_class: Report::ProfitAndLossByResourceReport,
                                            type: Types::Report::ProfitAndLossByResourceReport)
  field :profit_and_loss_statement,
        function: Functions::FindReport.new(model_class: Report::ProfitAndLossStatement,
                                            type: Types::Report::ProfitAndLossStatement)

  field :comparative_profit_and_loss_statement,
        function: Functions::FindReport.new(model_class: Report::ComparativeProfitAndLossStatement,
                                            type: Types::Report::ComparativeProfitAndLossStatement)

  field :vendorReport,
        function: Functions::FindReport.new(model_class: Report::VendorReport, type: Types::Report::VendorReport)
  field :vendor1099Report,
        function: Functions::FindAReport.new(model_class: :vendor_1099_report, type: Types::Report::Vendor1099Report)
  field :budgetVsActualReport,
        function: Functions::FindAReport.new(model_class: :budget_vs_actual_report,
                                             type: Types::Report::BudgetVsActualReport)
  field :checkRegisterReport, types[types.String] do
    description "Get Header fund codes for Check Register -- see also BankItemResolver"

    argument :start_date,       types.String
    argument :end_date,         types.String
    argument :min_amount,       types.String
    argument :max_amount,       types.String
    argument :bank_account_id,  types.ID
    argument :reconciled,       types.Boolean
    argument :approved,         types.Boolean
    argument :aasm_state,       types.String
    argument :type,             types.String
    argument :number,           types.String
    argument :memo,             types.String
    argument :vendor_id,        types.ID
    argument :include_entry,    types.Boolean

    resolve ->(_obj, args, context) {
      @items = BankAccount::ItemSearch.new(
        scope: context[:current_org].checks,
        filters: args.to_h.merge(include_entry: true)
      ).results.reject {|i| i.aasm_state == "voided" }.uniq(&:id)

      @fund_codes = @items.inject [] do |accum, bank_item|
        item_codes = bank_item.entry_items_by_fund_code.keys
        [*accum, *item_codes].uniq
      end

      @fund_codes
    }
  end
end
