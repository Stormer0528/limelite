# Mutations go here
# For Apollo, mutations are just speicalized queries
# We don't need the full setup for Relay
Types::MutationType = GraphQL::ObjectType.define do
  name "Mutation"

  # Statements
  #-----------------------------------------------------------------------------
  field :createStatement do
    type Types::StatementType
    description "Create/Update a Bank Accout Reconciliation Statement"

    argument :statement_id, types.ID
    argument :statementable_id, !types.ID
    argument :statementable_type, !types.String

    argument :adjustment_amount, types.String
    argument :adjustment_date,   types.String

    argument :started_at, !types.String
    argument :ended_at, !types.String
    argument :starting_balance, !types.String
    argument :ending_balance, !types.String

    argument :file_url, types.String
    argument :item_ids, types[types.ID]

    argument :state_action, types.String

    resolve ->(_obj, args, ctx) {
      current_org = ctx[:current_org]
      current_user = ctx[:current_user]
      account = current_org.send(args.statementable_type.underscore.pluralize).find(args[:statementable_id])

      statement = Statement.find_or_initialize_by(
        organization_id: current_org.id,
        id: args[:statement_id],
        statementable_id: args[:statementable_id],
        statementable_type: args[:statementable_type]
      )

      statement.assign_attributes(
        started_at: args[:started_at],
        ended_at: args[:ended_at],
        ending_balance: args[:ending_balance],
        starting_balance: args[:starting_balance],
        adjustment_amount: args[:adjustment_amount],
        file_url: args[:file_url],
        adjustment_date: DateTime.now
      )

      if statement.new_record? || args[:state_action] == "save_draft"
        statement.creator = ctx[:current_user]
        Audited.audit_class.as_user(ctx[:current_user]) do
          statement.save
        end
      end

      if statement.persisted? && args[:state_action] != "save_draft"
        statement.send(args[:state_action], user_id: current_user.id, reason: "",
                                            admin: current_user.admin?, user_group_id: ctx[:current_user_group]&.id)
      end

      # Remove/Add Items
      statement.reconciliations.each do |rec|
        rec.destroy unless args[:item_ids].include?(rec.reconcilable_item_id.to_s)
      end

      args[:item_ids].each do |item_id|
        item = account.items.find item_id
        item.reconcile(statement_id: statement.id)
      end

      # Ensure items are saved for audit
      statement.reload
      # TODO: Still need?
      statement.audits.last.save_associated_items if statement.audits.last.action == "create"

      statement
    }
  end

  # BankAccount::Items
  #-----------------------------------------------------------------------------
  field :createCheck do
    type Types::CheckType
    description "Create a Check"
    argument :check, InputObjects::CheckAttributes
    argument :stateAction, types.String
    argument :reason, types.String

    resolve ->(_obj, args, ctx) {
      current_user = ctx[:current_user]
      check = BankAccount::Check.new args[:check].to_h

      check.assign_attributes creator: current_user
      check.entry.assign_attributes creator: current_user,
                                    organization: ctx[:current_org]

      # Ensure payable_id is the same across entry
      payable_id   = check.entry.entry_items.map(&:payable_id).compact.first
      payable_type = check.entry.entry_items.map(&:payable_type).compact.first
      check.entry.entry_items.each do |item|
        item.assign_attributes payable_id: payable_id, payable_type: payable_type
      end

      # Handle save and state change
      check.save

      if check.valid? && args[:stateAction] != "save_draft"
        check.send(args[:stateAction], user_id: current_user.id, user_group_id: ctx[:current_user_group]&.id,
                                       reason: args[:reason] || "", admin: current_user.admin?)
      end

      check
    }
  end

  field :updateCheckFile do
    type types.String
    description "Update file associate with check"

    argument :id, !types.ID
    argument :fileUrl, types.String

    resolve ->(_obj, args, ctx) {
      current_user = ctx[:current_user]
      check = BankAccount::Check.find args[:id]
      check.update_attribute(:file_url, args[:fileUrl])

      return 'success'
    }
  end

  field :updateCheck do
    type Types::CheckType
    description "Update a Check"

    argument :check, InputObjects::CheckUpdateAttributes
    argument :stateAction, types.String
    argument :reason, types.String

    resolve ->(_obj, args, ctx) {
      current_user = ctx[:current_user]
      check = BankAccount::Check.find args[:check].id

      unless args[:stateAction] == "void"
        # Check entry attributes
        if check.entry
          orig_item_ids = check.entry.entry_items.map {|item| item.id.to_s }
          new_item_ids = args.to_h["check"].dig(:entry_attributes, :entry_items_attributes).map do |v|
            v[:id]
          end.compact
          delete_item_ids = orig_item_ids - new_item_ids

          check.entry.entry_items.each do |item|
            item.mark_for_destruction if delete_item_ids.include?(item.id.to_s)
          end
        end

        check.assign_attributes args[:check].to_h

        # Ensure payable_id is the same across entry
        new_items = args.to_h["check"].dig(:entry_attributes, :entry_items_attributes)
        payable_id = new_items.map {|item| item[:payable_id] }.compact.first
        payable_type = new_items.map {|item| item[:payable_type] }.compact.first

        check.entry.entry_items.each do |item|
          item.assign_attributes payable_id: payable_id, payable_type: payable_type
        end
      end

      check.save if args[:stateAction] == "save_draft"

      if check.persisted? && args[:stateAction] != "save_draft"
        check.send(args[:stateAction], user_id: current_user.id, user_group_id: ctx[:current_user_group]&.id,
                                       reason: args[:reason] || "", admin: current_user.admin?)
      end

      check
    }
  end

  field :destroyCheck, function: Functions::DestroyRecord.new(model_class: BankAccount::Check, type: Types::CheckType)

  field :markChecksPrinted do
    type Types::BaseResponse

    argument :bankAccountId, types.ID
    argument :checks, types[InputObjects::CheckPrintAttributes]

    resolve ->(_obj, args, ctx) {
      current_org = ctx[:current_org]
      error_messages = []
      checks = current_org.checks.where(id: args[:checks].map(&:id))

      args[:checks].sort_by {|c| c[:number] }.reverse!.each do |check_info|
        check = checks.find {|c| c.id == check_info.id.to_i }

        alt_check = checks.find {|c| c.number == check_info.number && c.id != check_info.id.to_i }
        alt_check&.update_attribute(:number, "")

        check.number = check_info.number
        if check.valid?
          check.paper_check = true
          check.print(user_id: ctx[:current_user].id)
        else
          error_messages.push("check number '#{check_info.number}' is already taken")
        end
      end

      # Return BaseResponse
      {success: error_messages.length == 0, error_messages: error_messages.uniq}
    }
  end

  field :markFileDownloaded do
    type Types::BaseResponse

    argument :fileUploadId, types.ID

    resolve ->(_obj, args, ctx) {
      params = {
        :user_id => ctx[:current_user].id,
        :file_upload_id => args[:fileUploadId]
      }

      log = ApFileDownloadLog.new params
      log.save

      {success: true, error_messages: []}
    }
  end

  field :createDeposit do
    type Types::DepositType
    description "Create a Deposit"

    argument :deposit, InputObjects::DepositAttributes
    argument :stateAction, types.String
    argument :reason, types.String

    resolve ->(_obj, args, ctx) {
      current_user = ctx[:current_user]
      deposit = BankAccount::Deposit.new args[:deposit].to_h

      deposit.assign_attributes creator: current_user
      deposit.entry.assign_attributes creator: current_user,
                                      organization: ctx[:current_org]

      # Ensure payable_id is the same across entry
      payable_id   = deposit.entry.entry_items.map(&:payable_id).compact.first
      payable_type = deposit.entry.entry_items.map(&:payable_type).compact.first
      deposit.entry.entry_items.each do |item|
        item.assign_attributes payable_id: payable_id, payable_type: payable_type
      end

      # Handle save and state change
      deposit.save

      if deposit.valid? && args[:stateAction] != "save_draft"
        deposit.send(args[:stateAction], user_id: current_user.id, user_group_id: ctx[:current_user_group]&.id,
                                         reason: args[:reason] || "", admin: current_user.admin?)
      end

      deposit
    }
  end

  field :updateDeposit do
    type Types::DepositType
    description "Update a Deposit"

    argument :deposit, InputObjects::DepositUpdateAttributes
    argument :stateAction, types.String
    argument :reason, types.String

    resolve ->(_obj, args, ctx) {
      current_user = ctx[:current_user]
      deposit = BankAccount::Deposit.find args[:deposit].id

      # Deposit entry attributes
      if deposit.entry
        orig_item_ids = deposit.entry.entry_items.map {|item| item.id.to_s }
        new_item_ids = args.to_h["deposit"].dig(:entry_attributes, :entry_items_attributes).map do |v|
          v[:id]
        end.compact
        delete_item_ids = orig_item_ids - new_item_ids

        deposit.entry.entry_items.each do |item|
          item.mark_for_destruction if delete_item_ids.include?(item.id.to_s)
        end

        deposit.assign_attributes args[:deposit].to_h

        # Ensure payable_id is the same across entry
        new_items = args.to_h["deposit"].dig(:entry_attributes, :entry_items_attributes)
        payable_id = new_items.map {|item| item[:payable_id] }.compact.first
        payable_type = new_items.map {|item| item[:payable_type] }.compact.first

        deposit.entry.entry_items.each do |item|
          item.assign_attributes payable_id: payable_id, payable_type: payable_type
        end
      end

      deposit.save if args[:stateAction] == "save_draft"

      if deposit.persisted? && args[:stateAction] != "save_draft"
        deposit.send(args[:stateAction], user_id: current_user.id, user_group_id: ctx[:current_user_group]&.id,
                                         reason: args[:reason] || "", admin: current_user.admin?)
      end

      deposit
    }
  end

  field :updateDepositFile do
    type types.String
    description "Update file associate with deposit"

    argument :id, !types.ID
    argument :fileUrl, types.String

    resolve ->(_obj, args, ctx) {
      current_user = ctx[:current_user]

      deposit = BankAccount::Deposit.find args[:id]

      deposit.update_attribute(:file_url, args[:fileUrl])

      return 'success'
    }
  end

  field :destroyDeposit,
        function: Functions::DestroyRecord.new(model_class: BankAccount::Deposit, type: Types::DepositType)

  field :createAccountTransfer do
    type Types::AccountTransferType
    description "Create an Account Transfer"

    argument :accountTransfer, InputObjects::AccountTransferAttributes
    argument :stateAction, types.String
    argument :reason, types.String

    resolve ->(_obj, args, ctx) {
      current_user = ctx[:current_user]
      account_transfer = BankAccount::AccountTransfer.new args[:accountTransfer].to_h

      account_transfer.assign_attributes creator: current_user
      account_transfer.entry.assign_attributes creator: current_user,
                                               organization: ctx[:current_org]

      # Handle save and state change
      account_transfer.save

      if account_transfer.valid? && args[:stateAction] != "save_draft"
        account_transfer.send(args[:stateAction], user_id: current_user.id,
                                                  reason: args[:reason] || "",
                                                  admin: current_user.admin?,
                                                  user_group_id: ctx[:current_user_group]&.id)
      end

      account_transfer
    }
  end

  field :updateAccountTransfer do
    type Types::AccountTransferType
    description "Update an Account Transfer"

    argument :accountTransfer, InputObjects::AccountTransferUpdateAttributes
    argument :stateAction, types.String
    argument :reason, types.String

    resolve ->(_obj, args, ctx) {
      current_user = ctx[:current_user]
      account_transfer = BankAccount::AccountTransfer.find args[:accountTransfer].id

      # Deposit entry attributes
      if account_transfer.entry
        orig_item_ids = account_transfer.entry.entry_items.map {|item| item.id.to_s }
        new_item_ids = args.to_h["accountTransfer"].dig(:entry_attributes, :entry_items_attributes).map do |v|
          v[:id]
        end.compact
        delete_item_ids = orig_item_ids - new_item_ids

        account_transfer.entry.entry_items.each do |item|
          item.mark_for_destruction if delete_item_ids.include?(item.id.to_s)
        end
      end

      account_transfer.assign_attributes args[:accountTransfer].to_h

      account_transfer.save if args[:stateAction] == "save_draft"

      if account_transfer.persisted? && args[:stateAction] != "save_draft"
        account_transfer.send(args[:stateAction], user_id: current_user.id, user_group_id: ctx[:current_user_group]&.id,
                                                  reason: args[:reason] || "",
                                                  admin: current_user.admin?)
      end

      account_transfer
    }
  end

  field :destroyAccountTransfer,
        function: Functions::DestroyRecord.new(model_class: BankAccount::AccountTransfer,
                                               type: Types::AccountTransferType)

  # Credit Cards
  #-----------------------------------------------------------------------------

  # Payments
  field :createPayment do
    type Types::CreditCardPaymentType
    description "Create a Payment"

    argument :payment, InputObjects::CreditCardPaymentAttributes
    argument :stateAction, types.String, default_value: "save_draft"
    argument :reason, types.String

    resolve ->(_obj, args, ctx) {
      current_user = ctx[:current_user]
      payment = CreditCard::Payment.new args[:payment].to_h

      payment.assign_attributes creator: current_user
      payment.entry.assign_attributes creator: current_user,
                                      organization: ctx[:current_org]

      # Ensure payable_id is the same across entry
      payable_id   = payment.entry.entry_items.map(&:payable_id).compact.first
      payable_type = payment.entry.entry_items.map(&:payable_type).compact.first
      payment.entry.entry_items.each do |item|
        item.assign_attributes payable_id: payable_id, payable_type: payable_type
      end

      # Handle save and state change
      payment.save

      if payment.valid? && args[:stateAction] != "save_draft"
        payment.send(args[:stateAction], user_id: current_user.id, user_group_id: ctx[:current_user_group]&.id,
                                         reason: args[:reason] || "", admin: current_user.admin?)
      end

      payment
    }
  end

  field :updatePayment do
    type Types::CreditCardPaymentType
    description "Update a Payment"

    argument :payment, InputObjects::CreditCardPaymentUpdateAttributes
    argument :stateAction, types.String, default_value: "save_draft"
    argument :reason, types.String

    resolve ->(_obj, args, ctx) {
      current_user = ctx[:current_user]
      payment = CreditCard::Payment.find args[:payment].id

      # Payment entry attributes
      if payment.entry
        orig_item_ids = payment.entry.entry_items.map {|item| item.id.to_s }
        new_item_ids = args.to_h["payment"].dig(:entry_attributes, :entry_items_attributes).map {|v|
          v[:id]
        }.compact
        delete_item_ids = orig_item_ids - new_item_ids

        payment.entry.entry_items.each do |item|
          item.mark_for_destruction if delete_item_ids.include?(item.id.to_s)
        end

        payment.assign_attributes args[:payment].to_h

        # Ensure payable_id is the same across entry
        new_items = args.to_h["payment"].dig(:entry_attributes, :entry_items_attributes)
        payable_id = new_items.map {|item| item[:payable_id] }.compact.first
        payable_type = new_items.map {|item| item[:payable_type] }.compact.first

        payment.entry.entry_items.each do |item|
          item.assign_attributes payable_id: payable_id, payable_type: payable_type
        end
      end

      payment.save if args[:stateAction] == "save_draft"

      if payment.persisted? && args[:stateAction] != "save_draft"
        payment.send(args[:stateAction], user_id: current_user.id, user_group_id: ctx[:current_user_group]&.id,
                                         reason: args[:reason] || "", admin: current_user.admin?)
      end

      payment
    }
  end

  field :destroyPayment,
        function: Functions::DestroyRecord.new(model_class: CreditCard::Payment, type: Types::CreditCardPaymentType)

  # Charges
  field :createCharge do
    type Types::CreditCardChargeType
    description "Create a Payment"

    argument :charge, InputObjects::CreditCardChargeAttributes
    argument :stateAction, types.String, default_value: "save_draft"
    argument :reason, types.String

    resolve ->(_obj, args, ctx) {
      current_user = ctx[:current_user]
      charge = CreditCard::Charge.new args[:charge].to_h

      charge.assign_attributes creator: current_user
      charge.entry.assign_attributes creator: current_user,
                                     organization: ctx[:current_org]

      # Ensure payable_id is the same across entry
      payable_id   = charge.entry.entry_items.map(&:payable_id).compact.first
      payable_type = charge.entry.entry_items.map(&:payable_type).compact.first
      charge.entry.entry_items.each do |item|
        item.assign_attributes payable_id: payable_id, payable_type: payable_type
      end

      # Handle save and state change
      charge.save

      if charge.valid? && args[:stateAction] != "save_draft"
        charge.send(args[:stateAction], user_id: current_user.id, user_group_id: ctx[:current_user_group]&.id,
                                        reason: args[:reason] || "", admin: current_user.admin?)
      end

      charge
    }
  end

  field :updateCharge do
    type Types::CreditCardChargeType
    description "Update a Payment"

    argument :charge, InputObjects::CreditCardChargeUpdateAttributes
    argument :stateAction, types.String, default_value: "save_draft"
    argument :reason, types.String

    resolve ->(_obj, args, ctx) {
      current_user = ctx[:current_user]
      charge = CreditCard::Charge.find args[:charge].id

      # charge entry attributes
      if charge.entry
        orig_item_ids = charge.entry.entry_items.map {|item| item.id.to_s }
        new_item_ids = args.to_h["charge"].dig(:entry_attributes, :entry_items_attributes).map {|v|
          v[:id]
        }.compact
        delete_item_ids = orig_item_ids - new_item_ids

        charge.entry.entry_items.each do |item|
          item.mark_for_destruction if delete_item_ids.include?(item.id.to_s)
        end

        charge.assign_attributes args[:charge].to_h

        # Ensure payable_id is the same across entry
        new_items = args.to_h["charge"].dig(:entry_attributes, :entry_items_attributes)
        payable_id = new_items.map {|item| item[:payable_id] }.compact.first
        payable_type = new_items.map {|item| item[:payable_type] }.compact.first

        charge.entry.entry_items.each do |item|
          item.assign_attributes payable_id: payable_id, payable_type: payable_type
        end
      end

      charge.save if args[:stateAction] == "save_draft"

      if charge.persisted? && args[:stateAction] != "save_draft"
        charge.send(args[:stateAction], user_id: current_user.id, user_group_id: ctx[:current_user_group]&.id,
                                        reason: args[:reason] || "", admin: current_user.admin?)
      end

      charge
    }
  end

  field :destroyCharge,
        function: Functions::DestroyRecord.new(model_class: CreditCard::Charge, type: Types::CreditCardChargeType)

  # Purchase Orders
  #-----------------------------------------------------------------------------
  field :createPurchaseOrder do
    type Types::PurchaseOrderType
    description "Create an Purchase Order"

    argument :purchaseOrder, InputObjects::PurchaseOrderAttributes
    argument :stateAction, types.String
    argument :reason, types.String

    resolve ->(_obj, args, context) {
      current_user = context[:current_user]
      po = PurchaseOrder.new args[:purchaseOrder].to_h

      po.assign_attributes  creator: current_user,
                            organization: context[:current_org]

      # Handle save and state change
      po.save

      if po.valid? && args[:stateAction] != "save_draft"
        po.send(args[:stateAction], user_id: current_user.id,
                                    reason: args[:reason] || "",
                                    admin: current_user.admin?,
                                    user_group_id: context[:current_user_group]&.id)
      end

      po
    }
  end

  field :updatePurchaseOrder do
    type Types::PurchaseOrderType
    description "Create an Purchase Order"

    argument :purchaseOrder, InputObjects::PurchaseOrderUpdateAttributes
    argument :stateAction, types.String
    argument :reason, types.String

    resolve ->(_obj, args, context) {
      current_user = context[:current_user]
      po = context[:current_org].purchase_orders.find args[:purchaseOrder]&.id

      po.purchase_order_items.each(&:mark_for_destruction)
      po.assign_attributes args[:purchaseOrder].to_h

      po.save if args[:stateAction] == "save_draft"

      if po.valid? && args[:stateAction] != "save_draft"
        po.send(args[:stateAction], user_id: current_user.id,
                                    reason: args[:reason] || "",
                                    user_group_id: context[:current_user_group]&.id,
                                    admin: current_user.admin?)
      end

      po
    }
  end

  field :deletePurchaseOrder, Types::PurchaseOrderType,
        function: Functions::DestroyRecord.new(model_class: PurchaseOrder, type: Types::PurchaseOrderType)

  # File Uploads
  #-----------------------------------------------------------------------------
  field :createFileUpload do
    type Types::FileUploadType
    description "Create a FileUpload"

    argument :fileUpload, InputObjects::FileUploadAttributes
    resolve  ->(_obj, args, context) {
      current_user = context[:current_user]
      upload = FileUpload.new args[:fileUpload].to_h

      upload.assign_attributes creator: current_user,
                               organization: context[:current_org]

      if upload.uploadable_type == 'User' and upload.uploadable_id.to_i == 0
        upload.uploadable_id = current_user.id
      end

      upload.save
      upload
    }
  end

  field :updateFileUpload do
    type Types::FileUploadType
    description "Update a FileUpload"

    argument :fileUpload, InputObjects::FileUploadUpdateAttributes

    resolve ->(_obj, args, context) {
      current_user = context[:current_user]
      upload = context[:current_org].file_uploads.find args[:fileUpload]&.id

      upload.assign_attributes args[:fileUpload].to_h
      upload.save
      upload
    }
  end

  # Payments
  #-----------------------------------------------------------------------------
  field :createCheckForPayments do
    argument :invoiceIds, !types[types.ID]
    argument :vendorId, !types.ID
    argument :addressId, types.ID
    argument :cashAccountId, !types.ID

    type Types::BaseResponse

    resolve ->(_obj, args, ctx) {
      begin
        invoices = args[:invoiceIds].map {|id| Invoice.find id }
        vendor = ctx[:current_org].vendors.find(args[:vendorId])
        cash_account = AccountObject.find args[:cashAccountId]

        check = cash_account.bank_account.checks.build \
          creator: ctx[:current_user],
          address_id: args[:addressId],
          date: Date.today,
          check_type: "Print"

        entry = check.build_entry \
          organization: ctx[:current_org],
          creator: ctx[:current_user],
          date: Date.today,
          entry_type: "Payment"

        invoices.map do |invoice|
          next unless invoice.entry

          invoice.entry.credits.map do |credit|
            # Get the first 9500 account to debit for the check
            debit_account = credit.account

            # Build the Debit side to balance Invoice
            entry.entry_items.build \
              amount: credit.amount,
              type: "Debit",
              account: debit_account,
              payable: vendor

            # Find the Credit side to balance the Debit
            credit_account = ctx[:current_org].accounts.find_or_create_by(
              account_fund_id: debit_account.account_fund_id,
              account_resource_id: debit_account.account_resource_id,
              account_year_id: debit_account.account_year_id,
              account_goal_id: debit_account.account_goal_id,
              account_function_id: debit_account.account_function_id,
              account_object_id: args[:cashAccountId],
              account_location_id: debit_account.account_location_id
            )

            # Build the Credits, which will connect to the Payment
            payment_entry_credit = entry.entry_items.build \
              amount: credit.amount,
              type: "Credit",
              account: credit_account,
              payable: vendor

            # Build the Payment
            payment_entry_credit.build_payment(
              payable: vendor,
              date: Date.today,
              invoice: invoice,
              creator: ctx[:current_user],
              address_id: args[:addressId],
              check: check
            )
          end
        end

        check.save(validate: false)

        # Approve stuff
        check.send_for_approval(
          user_id: ctx[:current_user].id,
          reason: "Appoved via Payment process.",
          admin: ctx[:current_user].admin?,
          user_group_id: ctx[:current_user_group]&.id
        )

        {success: check.errors.full_messages.empty?, error_messages: check.errors.full_messages}
      rescue ActiveRecord::RecordNotFound => e
        {success: false, error_messages: ["Unable to find #{e.model.titleize}"]}
      rescue StandardError => e
        {success: false, error_messages: [e.message]}
      end
    }
  end

  # Entries
  #-----------------------------------------------------------------------------
  field :createEntry do
    # Return Type
    type Types::EntryType
    description "Create an Entry"

    argument :date, types.String
    argument :entryType, types.String
    argument :fileUrl, types.String
    argument :entryItems, types[InputObjects::EntryItemAttributes]

    resolve ->(_obj, args, ctx) {
      entry = Entry.new(
        date: args[:date],
        entry_type: args[:entryType],
        file_url: args[:fileUrl],
        creator: ctx[:current_user],
        organization: ctx[:current_org],

        entry_items_attributes: args[:entryItems].to_a.map(&:to_h) || []
      )

      entry.save
      entry.send_for_approval(user_id: ctx[:current_user].id,
                              reason: "", admin: ctx[:current_user].admin?, user_group_id: ctx[:current_user_group]&.id)
      entry
    }
  end

  field :updateFinalPaymentUrl do
    type Types::BaseResponse
    description "Remove a user from all organizations and mark as archived"

    argument :invoiceID, types.ID
    argument :finalPaymentUrl, !types.String

    resolve ->(_obj, args, ctx) {
      begin
        org = ctx[:current_org]
        invoice = org.invoices.find args[:invoiceID]
        invoice.final_payment_url = args[:finalPaymentUrl]
        invoice.payments.last&.save

        return {success: true}
      rescue ActiveRecord::RecordNotFound
        return {success: false, error_messages: ["unable to find user"]}
      rescue StandardError => e
        {success: false, error_messages: [e.message]}
      end
    }
  end

  # Accounts
  #-----------------------------------------------------------------------------
  field :createAccount do
    # Return Type
    type Types::AccountType
    description "Create an Account"

    argument :budget,       types.Float
    argument :fundCode,     types.String
    argument :resourceCode, types.String
    argument :yearCode,     types.String
    argument :goalCode,     types.String
    argument :functionCode, types.String
    argument :objectCode,   types.String
    argument :locationCode, types.String

    resolve ->(_obj, args, ctx) {
      Account.create_with_partial_code \
        budget: args[:budget],
        fund: args[:fundCode],
        resource: args[:resourceCode],
        year: args[:yearCode],
        goal: args[:goalCode],
        function: args[:functionCode],
        object: args[:objectCode],
        location: args[:locationCode],
        organization_id: ctx[:current_org]&.id,
        fiscal_year: ctx[:fiscal_year]
    }
  end

  # State
  #-----------------------------------------------------------------------------
  field :updateState do
    type types.String
    description "Update State for Invoice"

    argument :id,             types.ID
    argument :slug,           types.String
    argument :nextState,      types.String
    argument :modelType,      types.String
    argument :reason,         types.String
    argument :save,           types.Boolean, default_value: true

    resolve ->(_obj, args, ctx) {
      return {} unless ctx[:current_org] || ctx[:current_user]

      current_org = ctx[:current_org]
      instance = current_org.send(args[:modelType].underscore.pluralize).find(args[:id])
      instance.send(args[:nextState], user_id: ctx[:current_user].id,
                                      reason: args[:reason] || "",
                                      admin: ctx[:current_user].admin?,
                                      user_group_id: ctx[:current_user_group]&.id)
      instance.save if args[:save]
      return instance.aasm_state
    }
  end

  # Users
  #-----------------------------------------------------------------------------
  field :authorizeAuthable do
    type Types::BaseResponse
    description "Approve/Deny and Authable Instance"

    argument :authableType, !types.String
    argument :authableAction, !types.String
    argument :authableId, !types.ID
    argument :reason, types.String

    resolve ->(_obj, args, ctx) {
      begin
        @model = args[:authableType].constantize
        @instance = @model.find args[:authableId]

        authorization = @instance.send("auth_#{args[:authableAction].downcase}",
                                       user_id: ctx[:current_user]&.id,
                                       reason: args[:reason],
                                       user_group_id: ctx[:current_user_group]&.id)

        return {
          success: authorization.valid?,
          error_messages: authorization.errors.full_messages
        }
      rescue NameError
        raise GraphQL::ExecutionError.new "Invalid Authable Type"
      rescue StandardError => e
        raise GraphQL::ExecutionError.new e.message
      end
    }
  end

  field :updateUserType do
    type types.Boolean
    description "Update a users user type for an organization"

    argument :userId, types.ID
    argument :organizationId, types.ID
    argument :type, types.String

    resolve ->(_obj, args, ctx) {
      # Get user
      begin
        user = User.find(args[:userId])
      rescue StandardError
        raise GraphQL::ExecutionError, "Unable to find user"
      end

      # Check org
      begin
        org = Organization.find(args[:organizationId])
      rescue StandardError
        raise GraphQL::ExecutionError, "Unable to find organization"
      end

      # Check if user can update
      auth_ctx = AuthorizationContext.new ctx[:current_user], ctx[:current_org]
      policy = OrganizationPolicy.new auth_ctx, org

      raise GraphQL::ExecutionError, "Unable to find organization" unless policy.update_users?

      if args[:type]
        # Update user type
        user.set_organization_role(args[:organizationId], args[:type].gsub(/Assignment/, "").downcase)
      else
        user.user_group_assignments.where(organization: ctx[:current_org]).map(&:destroy)
        user.organization_assignments.where(organization: ctx[:current_org]).map(&:destroy)
      end

      return true
    }
  end

  field :updateUserDepartment do
    type Types::BaseResponse
    description "Update a users department"

    argument :userId, !types.ID
    argument :departmentId, !types.ID

    resolve ->(_obj, args, ctx) {
              begin
                user = User.find(args[:userId])
                department = Department.find(args[:departmentId])

                # Check if user can update
                policy = OrganizationPolicy.new ctx[:auth_ctx], department.organization
                return {success: false, error_messages: ["Unable to update organization"]} unless policy.update_users?

                # Update user type
                user.department = department
                user.save(validate: false)

                {success: true, error_messages: []}
              rescue ActiveRecord::RecordNotFound => e
                {success: false, error_messages: ["Unable to find #{e.model}"]}
              rescue StandardError => e
                {success: false, error_messages: [e.message]}
              end
            }
  end

  field :updateFiscalYear do
    type types.Int
    description "Set the fiscal year for the interface"

    argument :fiscalYear, types.Int

    resolve ->(_obj, args, ctx) {
      @fiscal_year = FiscalYear.get_year(args[:fiscalYear])
      return ctx[:set_fiscal_year].call(@fiscal_year.year)
    }
  end

  field :updateUserRole do
    type Types::OrganizationAssignmentType
    description "Update a users user role for an organization"

    argument :userId, types.ID
    argument :organizationId, types.ID
    argument :role, types.String

    resolve ->(_obj, args, ctx) {
      # Get user
      begin
        user = User.find(args[:userId])
      rescue ActiveRecord::RecordNotFound
        raise GraphQL::ExecutionError, "Unable to find user"
      end

      # Check org
      begin
        org = Organization.find(args[:organizationId])
      rescue ActiveRecord::RecordNotFound
        raise GraphQL::ExecutionError, "Unable to find organization"
      end

      # Check if user can update
      auth_ctx = AuthorizationContext.new ctx[:current_user], ctx[:current_org]
      policy = OrganizationPolicy.new auth_ctx, org

      raise GraphQL::ExecutionError.new "unable to update User" unless policy.update_users?

      # # Get UserType
      org_type = user.organization_type(args[:organizationId]).gsub(/Assignment/, "")
      org_type = "Editor" if org_type == "None"

      # Update user type
      user.set_organization_role(
        args[:organizationId],
        org_type.downcase,
        args[:role]
      )
    }
  end

  field :archiveUser do
    type Types::BaseResponse
    description "Remove a user from all organizations and mark as archived"

    argument :userId, !types.ID

    resolve ->(_obj, args, ctx) {
      # Get user
      begin
        user = User.find(args[:userId])

        # Check if user can update
        auth_ctx = AuthorizationContext.new ctx[:current_user], ctx[:current_org]
        policy = AdminUsersPolicy.new auth_ctx, user

        return {success: false, error_messages: ["insufficient permission to delete this user"]} unless policy.destroy?

        # check for admin
        if user.admin? && !ctx[:current_user].super_admin?
          return {success: false,
                  error_messages: ["unable to delete admin user"]}
        end

        # remove from organizations
        user.organization_assignments.map(&:destroy)
        user.user_school_assignments.map(&:destroy)

        # mark as locked/archived
        return {success: true} if user.update_columns(locked_at: DateTime.now, archived: true)

        return {success: false, error_messages: user.errors.full_messages}
      rescue ActiveRecord::RecordNotFound
        return {success: false, error_messages: ["unable to find user"]}
      rescue StandardError => e
        {success: false, error_messages: [e.message]}
      end
    }
  end

  field :unArchiveUser do
    type Types::BaseResponse
    description "unArchive a user"

    argument :userId, !types.ID

    resolve ->(_obj, args, ctx) {
      begin
        user = User.find(args[:userId])

        return {success: true} if user.update_columns(locked_at: DateTime.now, archived: false)

        return {success: false, error_messages: user.errors.full_messages}
      rescue ActiveRecord::RecordNotFound
        return { success: false, error_messages: ["unable to find user"] }
      rescue StandardError => e
        {success: false, error_messages: [e.message]}
      end
    }
  end

  # User Groups
  #------------------------------------------------------------------------------
  field :createUserGroup do
    type Types::UserGroupType
    argument :parentId, types.ID
    argument :name, types.String
    argument :approvalAmount, types.Int
    argument :modulePermissions, InputObjects::ModulePermissionsAttributes
    argument :organizationId, !types.ID

    resolve ->(_obj, args, ctx) {
      group = ctx[:current_org].user_groups.create(
        name: args[:name],
        parent_id: args[:parentId]
      )

      group.module_permissions = (args[:modulePermissions].to_h || {}).transform_keys {|k| k.to_s.classify }

      group.module_permissions["approval_amount"] = args[:approvalAmount] || 0 if args[:approvalAmount]

      group.save
      group
    }
  end

  field :updateUserGroup do
    type Types::UserGroupType
    argument :userGroupId, !types.ID
    argument :name, types.String
    argument :approvalAmount, types.Int
    argument :parentId, types.ID
    argument :organizationId, !types.ID
    argument :modulePermissions, InputObjects::ModulePermissionsAttributes

    resolve ->(_obj, args, ctx) {
      group = ctx[:current_org].user_groups.find(args[:userGroupId])
      group.module_permissions ||= {}
      group.module_permissions = (args[:modulePermissions].to_h || {}).transform_keys {|k| k.to_s.classify }

      group.module_permissions["approval_amount"] = args[:approvalAmount] || 0 if args[:approvalAmount]

      group.update(name: args[:name], parent_id: args[:parentId])

      group
    }
  end

  field :updateUserGroupUsers do
    type Types::UserGroupType
    description "Update UserGroup users to be only the provided users with given ids"
    argument :userGroupId, !types.ID
    argument :organizationId, !types.ID
    argument :userIds, !types[types.ID]

    resolve ->(_obj, args, ctx) {
      begin
        group = ctx[:current_org].user_groups.find(args[:userGroupId])

        # Check Permissions
        group_policy = UserGroup.policy_class.new ctx[:auth_ctx], group
        raise GraphQL::ExecutionError.new "Not Authorized to edit this group" unless group_policy.edit?

        org_policy = OrganizationPolicy.new ctx[:auth_ctx], ctx[:current_org]
        raise GraphQL::ExecutionError.new "Not Authorized to edit users" unless org_policy.update_users?

        users = args[:userIds].map {|id| ctx[:current_org].users.find(id) }

        # Remove old associations
        group.user_group_assignments.map(&:mark_for_destruction)
        users.each do |user|
          user.user_group_assignments.where(organization: ctx[:current_org]).map(&:destroy)
        end

        # Create new
        users.each {|user|
          group.user_group_assignments.new user: user, organization: group.organization
        }
        group.save
        group
      rescue StandardError => e
        raise GraphQL::ExecutionError.new(e.message)
      end
    }
  end

  field :updateFundUsers do
    type Types::Account::AccountFund
    description "Update users for account funds"

    argument :accountFundId, !types.ID
    argument :organizationId, !types.ID
    argument :userIds, !types[types.ID]

    resolve ->(_obj, args, ctx) {
      begin
        fund = ctx[:current_org].account_funds.find(args[:accountFundId])

        org_policy = OrganizationPolicy.new ctx[:auth_ctx], ctx[:current_org]
        raise GraphQL::ExecutionError.new "Not Authorized to edit users" unless org_policy.update_users?

        users = args[:userIds].map {|id| ctx[:current_org].users.find(id) }

        # Remove old associations
        fund.user_school_assignments.map(&:mark_for_destruction)
        ctx[:current_org].users.each do |user|
          user.user_school_assignments.where(organization: ctx[:current_org], account_fund: fund).map(&:destroy)
        end

        # Create new
        users.each {|user|
          fund.user_school_assignments.new user: user, organization: fund.organization
        }
        fund.save
        fund
      rescue StandardError => e
        raise GraphQL::ExecutionError.new(e.message)
      end
    }
  end

  # Batch Uploads
  #------------------------------------------------------------------------------
  field :createBatchInvoiceUpload do
    type Types::BaseResponse
    description "Create a BatchUlpoad"
    argument :files, types[InputObjects::BatchInvoiceUploadFile]

    resolve ->(_obj, args, context) {
              def get_user_chain(user_group)
                group = user_group.parent
                approval_chain = []

                # Exit if no parent group
                return approval_chain unless group

                until group[:module_permissions]["approval_amount"] == 0
                  approval_chain << group
                  group = group.parent
                end
                approval_chain << approval_chain.last.parent unless approval_chain.empty?
                approval_chain
              end

              user_group = context[:current_user_group]
              approval_chain = get_user_chain(user_group)

              if approval_chain.empty?
                batch_ranges = {0..Float::INFINITY => []}
              else
                # Break amounts into ranges
                amounts = approval_chain.map {|group| group[:module_permissions]["approval_amount"] }
                batch_ranges = amounts.each_with_index.each_with_object({}) {|(total, index), ranges|
                  start_val = index.zero? ? 0 : amounts[index - 1]
                  end_val = total.zero? ? Float::INFINITY : total

                  range = Range.new start_val, end_val, true
                  ranges[range] = []
                  ranges
                }
              end

              # divide files into groups
              args[:files].each do |file|
                file[:accounts].keep_if {|a| a[:amount].positive? && a[:account_id] }
                total = file[:accounts].map(&:amount).sum * 100
                batch_ranges.keys.each do |r, _index|
                  batch_ranges[r] << file if r.include? total
                end
              end

              uploads = []

              batch_ranges.values.map do |files|
                next if files.count.zero?

                # Group items by
                uploads << context[:current_org].batch_uploads.new(files: files.map(&:to_h),
                                                                   creator: context[:current_user])
              end

              if uploads.all?(&:valid?)
                uploads.each do |upload|
                  upload.save
                  upload.send_for_approval(
                    user_id: context[:current_user].id,
                    reason: "",
                    admin: false,
                    user_group_id: context[:current_user_group]&.id
                  )
                end
              end

              { \
                success: uploads.all?(&:valid?),
                error_messages: uploads.map {|upload|
                  upload.errors.full_messages.map {|message|
                    message.gsub(/File/, "Batch Upload")
                  }
                }.flatten.compact
              }
            }
  end

  field :updateBatchInvoiceUpload do
    type Types::BaseResponse
    description "Update a BatchUlpoad"
    argument :id, !types.ID
    argument :files, types[InputObjects::BatchInvoiceUploadFile]

    resolve ->(_obj, args, context) {
      upload = context[:current_org].batch_uploads.find args[:id]

      updated_files = upload.files.map.with_index do |file, index|
        next file if file["approved"]

        file.merge(args[:files][index].to_h.stringify_keys)
      end

      if upload.valid?
        upload.files = updated_files
        upload.save
      end

      {success: upload.valid?, errors: upload.errors.full_messages}
    }
  end

  field :createInvoiceFromBatchFile do
    type Types::InvoiceResponse
    description "Create An Invoice From A Batch File"
    argument :file, InputObjects::BatchInvoiceUploadFile
    argument :id,   types.ID

    resolve ->(_obj, args, ctx) {
      begin
        user_group = ctx[:current_user_group]
        approval_amount = user_group[:module_permissions]["approval_amount"]
        invoice = ctx[:current_org].invoices.new number: args[:file][:invoice_number],
                                                 date: args[:file][:date] || Date.today,
                                                 due_date: args[:file][:due_date] || nil,
                                                 invoiceable_type: "Vendor"

        vendor = ctx[:current_org].vendors.find args[:file][:vendor_id]
        invoice.invoiceable = vendor
        invoice.creator = ctx[:current_user]
        invoice.file_url = args[:file][:url]

        # Find account
        account = ctx[:current_org].accounts.find args[:file][:accounts].first[:account_id]
        account_object = ctx[:current_org].account_objects.find_by code: "9500"
        account_9500 = ctx[:current_org].accounts.find_by account_object_id: account_object.id,
                                                          account_fund_id: account.account_fund_id

        # Create Invoice Entry
        entry = invoice.build_entry
        entry.organization = ctx[:current_org]
        entry.creator = ctx[:current_user]
        entry.date = Date.today

        args[:file][:accounts].each do |file|
          account = ctx[:current_org].accounts.find_by id: file[:account_id]
          entry.entry_items.new account: account, amount: file[:amount], type: "Debit", payable: vendor
        end

        entry.entry_items.new account: account_9500, amount: args[:file][:amount], type: "Credit", payable: vendor

        # Update batch upload files ....
        upload = BatchUpload.find(args[:id])
        file_index = upload.files.find_index {|f| f["handle"] == args[:file][:handle] }

        if approval_amount != 0 && args[:file][:amount] * 100 > approval_amount
          path = "#"
        elsif invoice.valid?
          invoice.save
          path = "/#{invoice.invoiceable_type.tableize}/#{invoice.invoiceable.slug}/invoices/#{invoice.slug}"

          upload.files[file_index]["approved"] = true if file_index
          upload.files[file_index]["path"] = path if file_index
          upload.files[file_index]["amount"] = args[:file][:amount] if file_index
          upload.files[file_index]["invoiceNumber"] = args[:file][:invoiceNumber] if file_index
        end

        upload.save

        if upload.files.map {|f| f["approved"] }.all?
          upload.approve(
            user_id: ctx[:current_user].id,
            reason: "",
            admin: false,
            user_group_id: ctx[:current_user_group]&.id
          )
        end

        {success: invoice.errors.full_messages.empty?, error_messages: invoice.errors.full_messages,
         invoice: invoice}
      rescue StandardError => e
        {success: false, error_messages: [e.message]}
      end
    }
  end

  field :denyBatchUploadFile do
    type Types::BaseResponse
    description "delete a file from a BatchUpload record"

    argument :id, !types.ID
    argument :fileIndex, !types.ID
    argument :reason, types.String

    resolve ->(_obj, args, context) {
      errors = []
      upload = context[:current_org].batch_uploads.find args[:id]
      file_index = args[:fileIndex].to_i
      file = upload.files[file_index]

      # If index doesn't exist
      errors << "Invoice Upload doesn't exist" unless file

      # If file is approved
      errors << "Can't deny an approved invoice upload" unless [nil, "", "#"].include?(file["path"])

      if errors.length.zero?
        upload.files[file_index]["approved"] = false
        upload.files[file_index]["notes"] = args[:reason]
        upload.save(validate: false)

        # Create Denial Message
        upload.deny(
          user_id: context[:current_user].id,
          reason: args[:reason],
          admin: false,
          user_group_id: context[:current_user_group]&.id
        )
      end

      # Success Case
      {success: errors.length == 0, error_messages: errors}
    }
  end

  field :deleteBatchUploadFile do
    type Types::BaseResponse
    description "delete a file from a BatchUpload record"

    argument :id, !types.ID
    argument :fileIndex, !types.ID

    resolve ->(_obj, args, context) {
      errors = []
      upload = context[:current_org].batch_uploads.find args[:id]
      file_index = args[:fileIndex].to_i
      file = upload.files[file_index]

      # If index doesn't exist
      errors << "Invoice Upload doesn't exist" unless file

      # If file is approved
      errors << "Can't delete an approved invoice upload" if file && file["approved"]

      if errors.length == 0
        upload.files.delete_at file_index
        upload.save

        if upload.files.map {|f| f["approved"] }.all?
          upload.approve(
            user_id: context[:current_user].id,
            reason: "",
            admin: false,
            user_group_id: context[:current_user_group]&.id
          )
        end
      end

      # Success Case
      {success: errors.length == 0, error_messages: errors}
    }
  end

  field :destroyBatchUpload,
        function: Functions::DestroyRecord.new(model_class: BatchUpload, type: Types::BatchUploadType)

  # User Preferences
  #------------------------------------------------------------------------------
  field :updateUserPreferences do
    type types.Boolean
    description "Update User Email Preferences"
    argument :emailPreference, types.String

    resolve ->(_obj, args, ctx) {
      user = ctx[:current_user]
      user.update preferences: {email_notifications: args[:emailPreference]}
    }
  end

  # Reports
  #-----------------------------------------------------------------------------
  field :createCashFlowReport do
    type Types::Report::CashFlowReport
    description "Create a Cash Flow Report"

    # Common Report Fields
    argument :id,              types.ID
    argument :start_date,      types.String
    argument :end_date,        types.String
    argument :account,         Types::AccountCodeInputObject

    # Custom Fields
    argument :display_columns_by,  types.String
    argument :show_active_columns, types.Boolean
    argument :show_active_rows,    types.Boolean

    resolve ->(_obj, args, ctx) {
      return {} unless ctx[:current_org]

      funds = Types::AccountCodeInputObject.intersect_funds(
        ctx[:current_user].accessible_funds(ctx[:current_org]&.id).map {|fund| fund.code }.sort,
        Types::AccountCodeInputObject.parse_account_funds(args[:account]&.fund_code)
      )

      report = Report::CashFlowReport.where(organization: ctx[:current_org]).where(
        "data->>'fund_code' = ?", funds.join(', ')
      ).order(:id).first

      if report.nil?
        report = Report::CashFlowReport.new
      end

      # only save if save is set to true
      report.assign_attributes(
        organization: ctx[:current_org],
        start_date: args[:start_date],
        end_date: args[:end_date],
        display_columns_by: args[:display_columns_by],
        show_active_columns: args[:show_active_columns],
        show_active_rows: args[:show_active_rows],
        account_search_params: args[:account].to_h.merge(fund_code: funds)
      )

      unless report.new_record?
        report.run_report(true)
      else
        report.save
      end
      return report
    }
  end

  field :createMonthlyCashFlowReport do
    type Types::Report::MonthlyCashFlowReport
    description "Create a Monthly Cash Flow Report"

    # Common Report Fields
    argument :id,              types.ID
    argument :start_date,      types.String
    argument :end_date,        types.String
    argument :account,         Types::AccountCodeInputObject

    # Custom Fields
    argument :display_columns_by,  types.String
    argument :show_active_columns, types.Boolean
    argument :show_active_rows,    types.Boolean

    resolve ->(_obj, args, ctx) {
      return {} unless ctx[:current_org]

      funds = Types::AccountCodeInputObject.intersect_funds(
        ctx[:current_user].accessible_funds(ctx[:current_org]&.id).map {|fund| fund.code }.sort,
        Types::AccountCodeInputObject.parse_account_funds(args[:account]&.fund_code)
      )

      report = Report::MonthlyCashFlowReport.where(organization: ctx[:current_org]).where(
        "data->>'fund_code' = ?", funds.join(', ')
      ).order(:id).first

      if report.nil?
        report = Report::MonthlyCashFlowReport.new
      end

      # only save if save is set to true
      report.assign_attributes(
        organization: ctx[:current_org],
        start_date: args[:start_date],
        end_date: args[:end_date],
        account_search_params: args[:account].to_h.merge({
          fund_code: funds
        })
      )

      unless report.new_record?
        report.run_report(true)
      else
        report.save
      end
      return report
    }
  end

  field :createBalanceSheet do
    type Types::Report::BalanceSheet
    description "Create a Balance Sheet Report"

    argument :save, types.Boolean, "Save report?", default_value: false

    # Common Report Fields
    argument :id,              types.ID
    argument :organization_id, types.ID
    argument :start_date,      types.String
    argument :end_date,        types.String
    argument :account,         Types::AccountCodeInputObject

    resolve ->(_obj, args, ctx) {
      return {} unless ctx[:current_org] && ctx[:current_user]

      funds = Types::AccountCodeInputObject.intersect_funds(
        ctx[:current_user].accessible_funds(ctx[:current_org]&.id).map {|fund| fund.code }.sort,
        Types::AccountCodeInputObject.parse_account_funds(args[:account]&.fund_code)
      )

      report = Report::BalanceSheet.where(organization: ctx[:current_org]).where(
        "data->>'fund_code' = ?", funds.join(', ')
      ).order(:id).first

      if report.nil?
        report = Report::BalanceSheet.new
      end

      report.assign_attributes(
        organization: ctx[:current_org],
        start_date: args[:start_date],
        end_date: args[:end_date],
        account_search_params: args[:account].to_h.merge({
          fund_code: funds
        })
      )

      unless report.new_record?
        report.run_report(true)
      else
        report.save
      end
      return report
    }
  end

  field :createComparativeBalanceSheet do
    type Types::Report::ComparativeBalanceSheet
    description "Create comparative Balance Sheet Report"

    argument :save, types.Boolean, "Save report?", default_value: false

    # Common Report Fields
    argument :id,              types.ID
    argument :organization_id, types.ID
    argument :start_date,      types.String
    argument :end_date,        types.String
    argument :account,         Types::AccountCodeInputObject

    resolve ->(_obj, args, ctx) {
      return {} unless ctx[:current_org]

      funds = Types::AccountCodeInputObject.intersect_funds(
        ctx[:current_user].accessible_funds(ctx[:current_org]&.id).map {|fund| fund.code }.sort,
        Types::AccountCodeInputObject.parse_account_funds(args[:account]&.fund_code)
      )

      report = Report::ComparativeBalanceSheet.where(
        organization: ctx[:current_org]
      ).where("data->>'fund_code' = ?", funds.join(', ')).first

      if report.nil?
        report = Report::ComparativeBalanceSheet.new
      end

      # only save if save is set to true
      report.assign_attributes(
        organization: ctx[:current_org],
        start_date: args[:start_date],
        end_date: args[:end_date],
        account_search_params: args[:account].to_h.merge({
          fund_code: funds
        })
      )

      unless report.new_record?
        report.run_report(true)
      else
        report.save
      end

      return report
    }
  end

  field :createBalanceSheetByMonth do
    type Types::Report::BalanceSheetByMonthReport
    description "Create a Balance Sheet By Month Report"

    # Common Report Fields
    argument :start_date,      types.String
    argument :end_date,        types.String
    argument :account,         Types::AccountCodeInputObject

    resolve ->(_obj, args, ctx) {
      return {} unless ctx[:current_org]

      funds = Types::AccountCodeInputObject.intersect_funds(
        ctx[:current_user].accessible_funds(ctx[:current_org]&.id).map {|fund| fund.code }.sort,
        Types::AccountCodeInputObject.parse_account_funds(args[:account]&.fund_code)
      )

      report = Report::BalanceSheetByMonth.where(
        organization: ctx[:current_org]
      ).where("data->>'fund_code' = ?", funds.join(', ')).order(:id).first

      if report.nil?
        report = Report::BalanceSheetByMonth.new
      end

      # only save if save is set to true
      report.assign_attributes(
        organization: ctx[:current_org],
        start_date: args[:start_date],
        end_date: args[:end_date],
        data: {},
        account_search_params: args[:account].to_h.merge({
          fund_code: funds
        })
      )

      unless report.new_record?
        report.run_report(true)
      else
        report.save
      end

      return report
    }
  end

  field :createBalanceSheetByResource do
    type Types::Report::BalanceSheetByResourceReport
    description "Create a Balance Sheet By Resource Report"

    # Common Report Fields
    argument :start_date,      types.String
    argument :end_date,        types.String
    argument :account,         Types::AccountCodeInputObject

    resolve ->(_obj, args, ctx) {
      return {} unless ctx[:current_org]

      funds = Types::AccountCodeInputObject.intersect_funds(
        ctx[:current_user].accessible_funds(ctx[:current_org]&.id).map {|fund| fund.code }.sort,
        Types::AccountCodeInputObject.parse_account_funds(args[:account]&.fund_code)
      )

      report = Report::BalanceSheetByResource.where(
        organization: ctx[:current_org]
      ).where("data->>'fund_code' = ?", funds.join(', ')).order(:id).first

      if report.nil?
        report = Report::BalanceSheetByResource.new
      end

      # only save if save is set to true
      report.assign_attributes(
        organization: ctx[:current_org],
        start_date: args[:start_date],
        end_date: args[:end_date],
        data: {},
        account_search_params: args[:account].to_h.merge({
          fund_code: funds
        })
      )

      unless report.new_record?
        report.run_report(true)
      else
        report.save
      end

      return report
    }
  end

  ## need to verify
  field :createProfitAndLossStatement do
    type Types::Report::ProfitAndLossStatement
    description "Create a Profit and Loss Statement"

    argument :save, types.Boolean, "Save report?", default_value: true

    # Common Report Fields
    argument :id,              types.ID
    argument :organization_id, types.ID
    argument :start_date,      types.String
    argument :end_date,        types.String
    argument :account,         Types::AccountCodeInputObject

    resolve ->(_obj, args, ctx) {
      return {} unless ctx[:current_org]

      funds = Types::AccountCodeInputObject.intersect_funds(
        ctx[:current_user].accessible_funds(ctx[:current_org]&.id).map {|fund| fund.code }.sort,
        Types::AccountCodeInputObject.parse_account_funds(args[:account]&.fund_code)
      )

      report = Report::ProfitAndLossStatement.where(
        organization: ctx[:current_org]
      ).where("data->>'fund_code' = ?", funds.join(', ')).order(:id).first

      if report.nil?
        report = Report::ProfitAndLossStatement.new
      end

      # only save if save is set to true
      report.assign_attributes(
        organization: ctx[:current_org],
        start_date: args[:start_date],
        end_date: args[:end_date],
        account_search_params: args[:account].to_h.merge({
          fund_code: funds
        })
      )

      unless report.new_record?
        report.run_report(true)
      else
        report.save
      end
      return report
    }
  end

  ## need to verify
  field :createComparativeProfitAndLossStatement do
    type Types::Report::ComparativeProfitAndLossStatement
    description "Create a Comparative Profit and Loss Statement"

    argument :save, types.Boolean, "Save report?", default_value: true

    # Common Report Fields
    argument :id,              types.ID
    argument :organization_id, types.ID
    argument :start_date,      types.String
    argument :end_date,        types.String
    argument :account,         Types::AccountCodeInputObject

    resolve ->(_obj, args, ctx) {
      return {} unless ctx[:current_org]

      funds = Types::AccountCodeInputObject.intersect_funds(
        ctx[:current_user].accessible_funds(ctx[:current_org]&.id).map {|fund| fund.code }.sort,
        Types::AccountCodeInputObject.parse_account_funds(args[:account]&.fund_code)
      )

      report = Report::ComparativeProfitAndLossStatement.where(
        organization: ctx[:current_org]
      ).where("data->>'fund_code' = ?", funds.join(', ')).order(:id).first

      if report.nil?
        report = Report::ComparativeProfitAndLossStatement.new
      end

      # only save if save is set to true
      report.assign_attributes(
        organization: ctx[:current_org],
        start_date: args[:start_date],
        end_date: args[:end_date],
        account_search_params: args[:account].to_h.merge({
          fund_code: funds
        })
      )

      unless report.new_record?
        report.run_report(true)
      else
        report.save
      end
      return report
    }
  end

  ## need to verify
  field :createMonthlyProfitAndLossStatement do
    type Types::Report::MonthlyProfitAndLossStatement
    description "Create a Monthly Profit And Loss Statement"

    # Common Report Fields
    argument :start_date,      types.String
    argument :end_date,        types.String
    argument :account,         Types::AccountCodeInputObject

    resolve ->(_obj, args, ctx) {
      return {} unless ctx[:current_org]

      funds = Types::AccountCodeInputObject.intersect_funds(
        ctx[:current_user].accessible_funds(ctx[:current_org]&.id).map {|fund| fund.code }.sort,
        Types::AccountCodeInputObject.parse_account_funds(args[:account]&.fund_code)
      )

      report = Report::MonthlyProfitLossStatement.where(
        organization: ctx[:current_org]
      ).where("data->>'fund_code' = ?", funds.join(', ')).order(:id).first

      if report.nil?
        report = Report::MonthlyProfitLossStatement.new
      end

      # only save if save is set to true
      report.assign_attributes(
        organization: ctx[:current_org],
        start_date: args[:start_date],
        end_date: args[:end_date],
        account_search_params: args[:account].to_h.merge({
          fund_code: funds
        })
      )

      unless report.new_record?
        report.run_report(true)
      else
        report.save
      end
      return report
    }
  end

  ## need to verify
  field :createProfitAndLossByResourceReport do
    type Types::Report::ProfitAndLossByResourceReport
    description "Create a Profit And Loss By Resource Report"

    # Common Report Fields
    argument :startDate,      types.String
    argument :endDate,        types.String
    argument :account, Types::AccountCodeInputObject

    resolve ->(_obj, args, ctx) {
      return {} unless ctx[:current_org]

      funds = Types::AccountCodeInputObject.intersect_funds(
        ctx[:current_user].accessible_funds(ctx[:current_org]&.id).map {|fund| fund.code }.sort,
        Types::AccountCodeInputObject.parse_account_funds(args[:account]&.fund_code)
      )

      report = Report::ProfitAndLossByResourceReport.where(
        organization: ctx[:current_org]
      ).where("data->>'fund_code' = ?", funds.join(', ')).order(:id).first

      if report.nil?
        report = Report::ProfitAndLossByResourceReport.new
      end
      # only save if save is set to true
      report.assign_attributes(
        organization: ctx[:current_org],
        start_date: args[:startDate],
        end_date: args[:endDate],
        account_search_params: args[:account].to_h.merge({
          fund_code: funds
        })
      )

      unless report.new_record?
        report.run_report(true)
      else
        report.save
      end
      return report
    }
  end

  field :createBudgetVsActualReport do
    type Types::Report::BudgetVsActualReport
    description "Create a BalanceVsActual Report"

    argument :save, types.Boolean, "Save report?", default_value: true

    # Common Report Fields
    argument :id,              types.ID
    argument :organization_id, types.ID
    argument :start_date,      types.String
    argument :end_date,        types.String
    argument :account,         Types::AccountCodeInputObject

    resolve ->(_obj, args, ctx) {
      return {} unless ctx[:current_org]

      funds = Types::AccountCodeInputObject.intersect_funds(
        ctx[:current_user].accessible_funds(ctx[:current_org]&.id).map {|fund| fund.code }.sort,
        Types::AccountCodeInputObject.parse_account_funds(args[:account]&.fund_code)
      )

      report = Report::BudgetVsActualReport.where(
        organization: ctx[:current_org]
      ).where("data->>'fund_code' = ?", funds.join(', ')).order(:id).first

      if report.nil?
        report = Report::BudgetVsActualReport.new
      end

      report.assign_attributes(
        organization: ctx[:current_org],
        start_date: args[:start_date],
        end_date: args[:end_date],
        account_search_params: args[:account].to_h.merge({
          fund_code: funds
        })
      )

      unless report.new_record?
        report.run_report(true)
      else
        report.save
      end
      return report
    }
  end

  field :createVendor1099Report do
    type Types::Report::Vendor1099Report
    description "Create a Vendor 1099 Report"

    # Common Report Fields
    argument :start_date,      types.String
    argument :end_date,        types.String

    resolve ->(_obj, args, ctx) {
      return {} unless ctx[:current_org]

      report = Report::Vendor1099Report
               .where(organization: ctx[:current_org])
               .find_or_initialize_by(organization: ctx[:current_org])

      # only save if save is set to true
      report.assign_attributes(
        start_date: args[:start_date],
        end_date: args[:end_date]
      )

      report.run_report(true)
      report.save
      return report
    }
  end

  field :createVendorReport do
    type Types::Report::VendorReport
    description "Create a Vendor Report"

    # Common Report Fields
    argument :start_date,      types.String
    argument :end_date,        types.String

    resolve ->(_obj, args, ctx) {
      return {} unless ctx[:current_org]

      funds = ctx[:current_user].accessible_funds(ctx[:current_org]&.id).map {|fund| fund.code }.sort

      report = Report::VendorReport.where(
        organization: ctx[:current_org]
      ).where("data->>'fund_code' = ?", funds.join(', ')).first

      if report.nil?
        report = Report::VendorReport.new
      end

      # only save if save is set to true
      report.assign_attributes(
        organization: ctx[:current_org],
        start_date: args[:start_date],
        end_date: args[:end_date],
        funds: funds
      )

      unless report.new_record?
        report.run_report(true)
      else
        report.save
      end
      return report
    }
  end

  field :createApAgingReport do
    type Types::Report::ApAgingReport
    description "Create a AP Aging Report"

    # Common Report Fields
    argument :start_date,      types.String
    argument :end_date,        types.String

    # Custom Fields
    # argument :aging_method, types.String
    argument :days_per_period, types.Int
    argument :show_active_columns, types.Boolean
    argument :show_active_rows, types.Boolean
    argument :periods, types.Int

    resolve ->(_obj, args, ctx) {
      return {} unless ctx[:current_org]

      funds = ctx[:current_user].accessible_funds(ctx[:current_org]&.id).map {|fund| fund.code }.sort
      report = Report::ApAgingReport.where(
        organization: ctx[:current_org]
      ).where("data->>'fund_code' = ?", funds.join(', ')).first

      if report.nil?
        report = Report::ApAgingReport.new
      end

      # only save if save is set to true
      report.assign_attributes(
        organization: ctx[:current_org],
        start_date: args[:start_date],
        end_date: args[:end_date],
        days_per_period: args[:days_per_period],
        show_active_columns: args[:show_active_columns],
        show_active_rows: args[:show_active_rows],
        periods: args[:periods],
        funds: funds
      )

      unless report.new_record?
        report.run_report(true)
      else
        report.save
      end
      return report
    }
  end

  field :createArAgingReport do
    type Types::Report::ArAgingReport
    description "Create a A/R Aging Report"

    # Common Report Fields
    argument :start_date,      types.String
    argument :end_date,        types.String

    # Custom Fields
    # argument :aging_method, types.String
    argument :days_per_period, types.Int
    argument :show_active_columns, types.Boolean
    argument :show_active_rows, types.Boolean
    argument :periods, types.Int

    resolve ->(_obj, args, ctx) {
      return {} unless ctx[:current_org]

      funds = ctx[:current_user].accessible_funds(ctx[:current_org]&.id).map {|fund| fund.code }.sort
      report = Report::ArAgingReport.where(
        organization: ctx[:current_org]
      ).where("data->>'fund_code' = ?", funds.join(', ')).first

      if report.nil?
        report = Report::ApAgingReport.new
      end

      # only save if save is set to true
      report.assign_attributes(
        organization: ctx[:current_org],
        start_date: args[:start_date],
        end_date: args[:end_date],
        days_per_period: args[:days_per_period],
        show_active_columns: args[:show_active_columns],
        show_active_rows: args[:show_active_rows],
        periods: args[:periods],
        funds: funds
      )

      unless report.new_record?
        report.run_report(true)
      else
        report.save
      end
      return report
    }
  end
end
