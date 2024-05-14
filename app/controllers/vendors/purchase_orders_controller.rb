class Vendors::PurchaseOrdersController < ApplicationController
  # before_action :set_vendor
  # before_action :set_purchase_order, only: [:show, :edit, :update, :destroy]
  # before_action :set_invoice, only: [:show, :edit, :update, :destroy]

  # GET /purchase_orders
  # GET /purchase_orders.json
  def index
    # @has_own_navigation = true
    render layout: "application_minimal"
  end

  # GET /purchase_orders/1
  # GET /purchase_orders/1.json
  # def show; end

  # GET /purchase_orders/new
  # def new; end

  # GET /purchase_orders/1/edit
  # def edit; end

  # POST /purchase_orders
  # POST /purchase_orders.json
  # def create
  #   @purchase_order = @vendor.purchase_orders.new(purchase_order_params)

  #   respond_to do |format|
  #     if @purchase_order.save
  #       format.html { redirect_to vendor_purchase_order_path(@vendor, @purchase_order), notice: "Purchase order was successfully created." }
  #       format.json { render :show, status: :created, location: vendor_purchase_order_url(@vendor, @purchase_order) }
  #     else
  #       format.html { render :new }
  #       format.json { render json: @purchase_order.errors, status: :unprocessable_entity }
  #     end
  #   end
  # end

  # PATCH/PUT /purchase_orders/1
  # PATCH/PUT /purchase_orders/1.json
  # def update
  #   respond_to do |format|
  #     if @purchase_order.update(purchase_order_params)
  #       format.html { redirect_to vendor_purchase_order_path(@vendor, @purchase_order), notice: "Purchase order was successfully updated." }
  #       format.json { render :show, status: :ok, location: vendor_purchase_order_url(@vendor, @purchase_order) }
  #     else
  #       format.html { render :edit }
  #       format.json { render json: @purchase_order.errors, status: :unprocessable_entity }
  #     end
  #   end
  # end

  # DELETE /purchase_orders/1
  # DELETE /purchase_orders/1.json
  # def destroy
  #   @purchase_order.destroy
  #   respond_to do |format|
  #     format.html { redirect_to vendor_purchase_orders_url(@vendor), notice: "Purchase order was successfully destroyed." }
  #     format.json { head :no_content }
  #   end
  # end

  # Use callbacks to share common setup or constraints between actions.
  # def set_purchase_order
  #   @purchase_order = @vendor.purchase_orders.friendly.find(params[:id])
  # end

  # # Never trust parameters from the scary internet, only allow the white list through.
  # def purchase_order_params
  #   params.require(:purchase_order).permit(:vendor_id, :invoice_id, :number, :date_needed, :blanket, :stock_po, :status, :buyer, :requisition_number, :requested_by, :requested_for, :file_url)
  # end

  # def set_vendor
  #   @vendor = @current_org.vendors.friendly.find(params[:vendor_id])
  # end

  # def set_invoice
  #   @invoice = @purchase_order.invoice
  # end
end
