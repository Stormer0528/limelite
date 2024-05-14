class Customers::PaymentsController < ApplicationController
  before_action :set_accounts_and_elements
  before_action :set_customer
  before_action :set_invoice

  # GET /payments/1
  # GET /payments/1.json
  def show
    @payment = @invoice.payments.find(params[:id])
    authorize @payment
  end

  # GET /payments/new
  def new
    @payment = @customer.payments.new(invoice: @invoice, date: Date.today)
    authorize @payment
    @entry = @payment.build_entry(creator: @current_user, organization: @current_org)
  end

  # POST /payments
  # POST /payments.json
  def create
    @payment = @customer.payments.new(invoice: @invoice, date: Date.today)
    authorize @payment
    @payment.build_entry(creator: @current_user, organization: @current_org)
    @payment.assign_attributes payment_params

    respond_to do |format|
      if @payment.save
        format.html { redirect_to customer_invoice_payment_path(@customer, @invoice, @payment), notice: "Payment was successfully created." }
        format.json { render :show, status: :created, location: customer_invoice_payment_url(@customer, @invoice, @payment) }
      else
        format.html { render :new }
        format.json { render json: @payment.errors, status: :unprocessable_entity }
      end
    end
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_customer
    @customer = @current_org.customers.friendly.find(params[:customer_id])
  end

  def set_invoice
    @invoice = @customer.invoices.friendly.find(params[:invoice_id])
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def payment_params
    params.require(:customer_payment).permit(
        :customer_id, :invoice_id, :purchase_order_id, :final_pay, :date,
        :file_url, entry_attributes: [
          :id, :date, :entry_type, :file_url,
          {entry_items_attributes: [:id, :account_id, :amount, :amount_in_cents, :type, :memo, :payable_type, :payable_id]}
        ]
      )
  end
end
