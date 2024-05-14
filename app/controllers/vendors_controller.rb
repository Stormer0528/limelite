class VendorsController < ApplicationController
  include LoggableController

  before_action :set_vendor, only: %i[show edit update destroy]

  # GET /vendors
  # GET /vendors.json
  def index
    authorize :vendor, :index?
    @invoices = @current_org.vendor_invoices.includes(:invoiceable, :payments, :entry).order(due_date: :desc)
    @vendors  = @current_org.vendors.order({company: :asc}, {first_name: :asc})
    @purchase_orders = @current_org.purchase_orders
  end

  # GET /vendors/1
  # GET /vendors/1.json
  def show
    authorize @vendor
  end

  # GET /vendors/new
  def new
    @vendor = @current_org.vendors.new
    authorize @vendor
    set_new_vendor_associations
  end

  # GET /vendors/1/edit
  def edit
    authorize @vendor
    set_new_vendor_associations
  end

  # POST /vendors
  # POST /vendors.json
  def create
    @vendor = @current_org.vendors.new
    authorize @vendor

    @vendor.assign_attributes vendor_params
    @vendor.creator = @current_user

    respond_to do |format|
      if @vendor.valid? && update_state(@vendor)
        format.html { redirect_to @vendor, notice: "Vendor was successfully created." }
        format.json { render :show, status: :created, location: @vendor }
      else
        format.html { render :new }
        format.json { render json: @vendor.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /vendors/1
  # PATCH/PUT /vendors/1.json
  def update
    authorize @vendor
    @vendor.assign_attributes vendor_params

    respond_to do |format|
      if @vendor.valid? && update_state(@vendor)
        format.html { redirect_to @vendor, notice: "Vendor was successfully updated." }
        format.json { render :show, status: :ok, location: @vendor }
      else
        format.html { render :edit }
        format.json { render json: @vendor.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /vendors/1
  # DELETE /vendors/1.json
  def destroy
    authorize @vendor
    @vendor.destroy
    respond_to do |format|
      format.html { redirect_to vendors_url, notice: "Vendor was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_vendor
    @vendor = @current_org.vendors.friendly.find(params[:id])
  end

  def set_new_vendor_associations
    @vendor.build_home_phone unless @vendor.home_phone
    @vendor.build_work_phone unless @vendor.work_phone
    @vendor.build_mobile_phone unless @vendor.mobile_phone
    @vendor.build_fax_phone unless @vendor.fax_phone
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def vendor_params
    params.require(:vendor)
          .permit(
            :id, :ein_type, :title, :first_name, :middle_name, :last_name, :primary_phone, :suffix,
            :company, :notes, :email, :other, :website, :account_number,
            :active, :payment_terms, :global, :ein, :ten_ninety_nine_address_id,
            :name, :rating, :logo_url, :file_url, :ten_ninety_nine,
            :starting_balance, :start_date, :end_date,
            {addresses_attributes: %i[_destroy name id attention department line1 line2 city state zip]},
            {ten_ninety_nines_attributes: %i[_destroy id year required address_id ein ein_type file_url]},
            {home_phone_attributes: [:id, :number]},
            {mobile_phone_attributes: [:id, :number]},
            {work_phone_attributes: [:id, :number]},
            fax_phone_attributes: [:id, :number]
          )
  end
end
