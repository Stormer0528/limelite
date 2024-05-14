class Vendors::InvoicesController < ApplicationController
  include LoggableController

  before_action :set_accounts_and_elements
  before_action :set_vendor
  before_action :set_invoice, only: [:show, :edit, :update, :destroy]

  # GET /invoices
  # GET /invoices.json
  def index
    authorize :standard, :index?
    @invoices = @vendor.invoices
  end

  # GET /invoices/1
  # GET /invoices/1.json
  def show
    authorize @invoice
    @payment = @vendor.payments.build(date: Date.today, invoice: @invoice)
    @account_objects = @current_org.account_objects.with_bank_account
    @addresses = @vendor.addresses
  end

  # GET /invoices/new
  def new
    @account_objects = @current_org.account_objects.with_bank_account
    @addresses = @vendor.addresses

    @invoice = @vendor.invoices.new(date: Date.today, organization: @current_org)
    authorize @invoice
    set_purchase_order

    @invoice.purchase_order = @purchase_order if @purchase_order

    @entry = @invoice.build_entry(creator: @current_user, organization: @current_org,
                                  date: Date.today)

    ["Debit", "Credit"].map {|t| @entry.entry_items.build(type: t, payable: @vendor) }
  end

  # GET /invoices/1/edit
  def edit
    @account_objects = @current_org.account_objects.with_bank_account
    @addresses = @vendor.addresses

    authorize @invoice
    set_purchase_order

    @invoice.entry&.entry_items&.standard_ordering
  end

  # POST /invoices
  # POST /invoices.json
  def create
    @invoice = @vendor.invoices.new(organization: @current_org, creator: @current_user)
    authorize @invoice
    set_purchase_order

    @invoice.purchase_order = @purchase_order if @purchase_order

    @invoice.build_entry(creator: @current_user, organization: @current_org)
    @invoice.assign_attributes invoice_params
    @invoice.entry_items.each do |item|
      item.payable = @vendor
    end

    respond_to do |format|
      if @invoice.valid? && update_state(@invoice)
        format.html { redirect_to vendor_invoice_path(@vendor, @invoice), notice: "Invoice was successfully created." }
        format.json { render :show, status: :created, location: vendor_invoice_path(@vendor, @invoice) }
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
    set_purchase_order

    @invoice.purchase_order = @purchase_order

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

      @invoice.assign_attributes(invoice_params)
      @invoice.entry_items.each do |item|
        item.payable = @vendor
      end
    end

    respond_to do |format|
      if @invoice.valid? && update_state(@invoice)
        format.html { redirect_to vendor_invoice_path(@vendor, @invoice), notice: "Invoice was successfully updated." }
        format.json { render :show, status: :ok, location: vendor_invoice_path(@vendor, @invoice) }
      else
        format.html { render :edit }
        format.json { render json: @invoice.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /invoices/1
  # DELETE /invoices/1.json
  def destroy
    authorize @invoice
    @invoice.destroy
    respond_to do |format|
      format.html { redirect_to vendor_url(@vendor, anchor: "invoices"), notice: "Invoice was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_vendor
    @vendor = @current_org.vendors.friendly.find(params[:vendor_id])
  end

  def set_invoice
    @invoice = @vendor.invoices.friendly.find(params[:id])
  end

  def set_purchase_order
    @purchase_order = @invoice.purchase_order || @vendor.purchase_orders.find_by(id: params[:purchase_order_id])
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def invoice_params
    params.require(:invoice).permit(
      :id, :number, :date, :description, :notes, :due_date, :final_payment_url,
      :file_url, :purchase_order_id, :account_object_id, :address_id,
      entry_attributes: [
        :id, :date, :entry_type, :file_url,
        {entry_items_attributes: [:id, :account_id, :amount, :amount_in_cents, :type, :memo, :payable_type, :payable_id]}
      ]
    )
  end

  def vendor_invoice_path(vendor, invoice)
    "/vendors/#{vendor.slug}/invoices/#{invoice.id}"
  end
end
