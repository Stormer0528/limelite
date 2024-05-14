class CustomersController < ApplicationController
  include LoggableController

  before_action :set_customer, only: %i[show edit update destroy]

  # GET /customers
  # GET /customers.json
  def index
    authorize :customer, :index?
  end

  # GET /customers/1
  # GET /customers/1.json
  def show
    authorize @customer
  end

  # GET /customers/new
  def new
    @customer = @current_org.customers.new
    authorize @customer
    set_new_customer_assocations
  end

  # GET /customers/1/edit
  def edit
    authorize @customer
    set_new_customer_assocations
  end

  # POST /customers
  # POST /customers.json
  def create
    @customer = @current_org.customers.new(customer_params)
    authorize @customer
    set_new_customer_assocations

    respond_to do |format|
      if @customer.valid? && update_state(@customer)
        format.html { redirect_to @customer, notice: "Customer was successfully created." }
        format.json { render :show, status: :created, location: @customer }
      else
        format.html { render :new }
        format.json { render json: @customer.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /customers/1
  # PATCH/PUT /customers/1.json
  def update
    authorize @customer
    respond_to do |format|
      if @customer.valid? && update_state(@customer)
        format.html { redirect_to @customer, notice: "Customer was successfully updated." }
        format.json { render :show, status: :ok, location: @customer }
      else
        format.html { render :edit }
        format.json { render json: @customer.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /customers/1
  # DELETE /customers/1.json
  def destroy
    authorize @customer
    @customer.destroy
    respond_to do |format|
      format.html { redirect_to customers_url, notice: "Customer was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_customer
    @customer = @current_org.customers.friendly.find(params[:id])
  end

  def set_new_customer_assocations
    @customer.creator = @current_user
    @customer.addresses.build if @customer.addresses.empty?
    @customer.build_home_phone unless @customer.home_phone
    @customer.build_work_phone unless @customer.work_phone
    @customer.build_mobile_phone unless @customer.mobile_phone
    @customer.build_fax_phone unless @customer.fax_phone
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def customer_params
    params.require(:customer).permit(
      :id, :title, :first_name, :last_name, :middle_name, :suffix, :company, :email,
      :website, :notes, :logo_url, :number,
      {addresses_attributes: %i[name attention department id line1 line2 city state zip]},
      {home_phone_attributes: [:number]},
      {mobile_phone_attributes: [:number]},
      {work_phone_attributes: [:number]},
      fax_phone_attributes: [:number]
    )
  end
end
