class BatchPaymentsController < ApplicationController
  def index
    authorize :standard, :index?
    @open_invoices = @current_org.invoices.for_batch
    @account_objects = @current_org.account_objects.with_bank_account

  end

  def create
    authorize :standard, :create?
    cash_account = AccountObject.find(batch_params[:account_object_id])

    @invoices = Invoice.where(id: batch_params[:invoice_ids])

    @invoices.each do |invoice|
      check = cash_account.bank_account.checks.build(
        creator: @current_user,
        date:    batch_params[:date],
        address: invoice.invoiceable.addresses.first
      )

      entry = check.build_entry(creator:      @current_user,
                                organization: @current_org,
                                entry_type:   "Payment",
                                date:         batch_params[:date])

      # Build Payment Debit from Invoice Credit
      invoice.entry.credits.each do |credit|
        debit_account = credit.account

        # Create Entry Debits
        entry.entry_items.build(amount:  credit.amount,
                                type:    "Debit",
                                account: debit_account,
                                payable: invoice.invoiceable)

        # Create Entry Credits
        credit_account = @current_org.accounts.find_or_create_by(
          account_fund_id:     debit_account.account_fund_id,
          account_resource_id: debit_account.account_resource_id,
          account_year_id:     debit_account.account_year_id,
          account_goal_id:     debit_account.account_goal_id,
          account_function_id: debit_account.account_function_id,
          account_object_id:   batch_params[:account_object_id],
          account_location_id: debit_account.account_location_id
        )

        # Build Payment Credit from Account Selection
        payment_entry_credit = entry.entry_items.build(
          amount:  credit.amount,
          type:    "Credit",
          account: credit_account,
          payable: invoice.invoiceable
        )

        payment_entry_credit.build_payment(
          payable: invoice.invoiceable,
          invoice: invoice,
          creator: @current_user,
          date:    batch_params[:date],
          address: invoice.invoiceable.addresses.first,
          check:   check
        )
      end

      break unless check.save
    end

    respond_to do |format|
      unless @invoices.empty?
        format.html { redirect_to batch_payments_path, notice: "Payments were created." }
        format.json { render :index, status: :created, location: batch_payments_path }
      else
        format.html { render :index }
        format.json { render json: @payment.errors, status: :unprocessable_entity }
      end
    end
  end


  private
  def batch_params
    params.require(:batch).permit(:date, :account_object_id, invoice_ids: [])
  end
end

