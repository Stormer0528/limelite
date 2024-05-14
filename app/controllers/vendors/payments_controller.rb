class Vendors::PaymentsController < ApplicationController
  before_action :set_accounts_and_elements
  before_action :set_vendor
  before_action :set_invoice

  # GET /payments/1
  # GET /payments/1.json
  def show
    @payment = @vendor.payments.find(params[:id])
    authorize @payment
  end

  # GET /payments/new
  def new
    @payment = @vendor.payments.new(invoice: @invoice, date: Date.today,
                                    creator: @current_user)
    authorize @payment
    @entry = @payment.build_entry(creator: @current_user, organization: @current_org)
  end

  # POST /payments
  # POST /payments.json
  def create
    authorize :payment, :create?
    cash_account = AccountObject.find(account_params[:cash_account])

    @check = cash_account.bank_account.checks.build(
      creator: @current_user,
      address_id: payment_params[:address_id],
      date: Date.today,
      check_type: "Print"
    )

    @entry = @check.build_entry(
      creator: @current_user,
      organization: @current_org,
      entry_type: "Payment",
      date: Date.today
    )

    # Build Payment from Invoice Entry
    @invoice.entry.credits.each do |credit|
      # Create Entry Debits
      debit_account = credit.account

      @entry.entry_items.build(
        amount: credit.amount,
        type: "Debit",
        account: debit_account,
        payable: @vendor
      )

      # Build Payment Credit from Bank Account Selection
      credit_account = @current_org.accounts.find_or_create_by(
        account_fund_id: debit_account.account_fund_id,
        account_resource_id: debit_account.account_resource_id,
        account_year_id: debit_account.account_year_id,
        account_goal_id: debit_account.account_goal_id,
        account_function_id: debit_account.account_function_id,
        account_object_id: account_params[:cash_account],
        account_location_id: debit_account.account_location_id
      )

      payment_entry_credit = @entry.entry_items.build(
        amount: credit.amount,
        type: "Credit",
        account: credit_account,
        payable: @vendor
      )

      @payment = payment_entry_credit.build_payment(
        payable: @vendor,
        date: Date.today,
        invoice: @invoice,
        creator: @current_user,
        address_id: payment_params[:address_id],
        check: @check
      )
    end

    respond_to do |format|
      if @check.save(validate: false)
        @check.send_for_approval(
          user_id: @current_user.id,
          user_group_id: @current_user_group.id,
          reason: "Approved via Payment process.",
          admin: @current_user.admin?
        )
        format.html {
          redirect_to vendor_invoice_payment_path(@vendor, @invoice, @payment),
                      notice: "Payment was successfully created."
        }
        format.json {
          render :show, status: :created, location: vendor_invoice_payment_url(@vendor, @invoice, @payment)
        }
      else
        format.html { render :new }
        format.json { render json: @payment.errors, status: :unprocessable_entity }
      end
    end
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_vendor
    @vendor = @current_org.vendors.friendly.find(params[:vendor_id])
  end

  def set_invoice
    @invoice = @vendor.invoices.friendly.find(params[:invoice_id])
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def payment_params
    params.require(:payment)
          .permit(:vendor_id, :invoice_id, :purchase_order_id, :final_pay, :date,
                  :tax_amount, :tax_amount_in_cents, :address_id,
                  :shipping_amount, :shipping_amount_in_cents, :file_url,
                  entry_attributes: [:date, :entry_type, :file_url,
                                     {entry_items_attributes: [:account_id, :amount, :type, :memo, :payable_type, :payable_id]}])
  end

  def account_params
    params.require(:account).permit(:cash_account)
  end
end
