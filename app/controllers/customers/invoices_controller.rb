class Customers::InvoicesController < ApplicationController
  include LoggableController

  before_action :set_accounts_and_elements
  before_action :set_customer
  before_action :set_invoice, only: %i[show edit update destroy]

  # GET /invoices
  # GET /invoices.json
  def index
    authorize :standard, :index?
    @invoices = @customer.invoices
  end

  # GET /invoices/1
  # GET /invoices/1.json
  def show
    authorize @invoice
    @payment = @customer.payments.build(date: Date.today, invoice: @invoice)
    @account_objects = @current_org.account_objects.with_bank_account
    @addresses = @customer.addresses
  end

  # GET /invoices/new
  def new
    @invoice = @customer.invoices.new(date: Date.today, organization: @current_org)
    authorize @invoice

    @invoice.build_entry(creator: @current_user, organization: @current_org,
                         date: Date.today, entry_type: "Accounts Receivable")
  end

  # GET /invoices/1/edit
  def edit
    authorize @invoice

    @invoice.build_entry(creator: @current_user, organization: @current_org) unless @invoice.entry
  end

  # POST /invoices
  # POST /invoices.json
  def create
    @invoice = @customer.invoices.new(organization: @current_org, creator: @current_user)
    authorize @invoice

    @invoice.build_entry(creator: @current_user, organization: @current_org)
    @invoice.assign_attributes invoice_params

    respond_to do |format|
      if @invoice.valid? && update_state(@invoice)
        format.html {
          redirect_to customer_invoice_path(@customer, @invoice), notice: "Invoice was successfully created."
        }
        format.json { render :show, status: :created, location: customer_invoice_path(@customer, @invoice) }
      else
        format.html { render :new }
        format.json { render json: @invoice.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /invoices/1
  # PATCH/PUT /invoices/1.json
  def update
    authorize @invoice

    @invoice.build_entry(creator: @current_user, organization: @current_org) unless @invoice.entry

    if @invoice.entry && invoice_params.dig(:entry_attributes, :entry_items_attributes)
      # Remove Entry Items that are deleted
      orig_item_ids = @invoice.entry.entry_items.map {|item| item.id.to_s }
      new_item_ids = invoice_params.dig(:entry_attributes, :entry_items_attributes).values.map {|v|
        v["id"]
      }.compact
      delete_item_ids = orig_item_ids - new_item_ids
      @invoice.entry_items.each do |item|
        item.mark_for_destruction if delete_item_ids.include?(item.id.to_s)
      end
    end
    @invoice.assign_attributes(invoice_params)

    respond_to do |format|
      if @invoice.valid? && update_state(@invoice)
        format.html {
          redirect_to customer_invoice_path(@customer, @invoice), notice: "Invoice was successfully updated."
        }
        format.json { render :show, status: :ok, location: customer_invoice_path(@customer, @invoice) }
      else
        format.html { render :edit }
        format.json { render json: @invoice.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /invoices/1
  # DELETE /invoices/1.json
  def destroy
    @invoice.destroy
    respond_to do |format|
      format.html { redirect_to customer_invoices_url, notice: "Invoice was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_customer
    @customer = @current_org.customers.friendly.find(params[:customer_id])
  end

  def set_invoice
    @invoice = @customer.invoices.friendly.find(params[:id])
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def invoice_params
    params.require(:invoice).permit(
      :id, :number, :date, :description, :notes, :due_date,
      :file_url, entry_attributes: [
        :id, :date, :entry_type, :file_url,
        {entry_items_attributes: [:id, :account_id, :amount, :amount_in_cents, :type, :memo, :payable_type, :payable_id]}
      ]
    )
  end
end
