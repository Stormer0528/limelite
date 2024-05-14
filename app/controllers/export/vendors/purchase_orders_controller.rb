class Export::Vendors::PurchaseOrdersController < ApplicationController
  before_action :set_vendor, only: [:show]
  before_action :set_purchase_order, only: [:show]
  before_action :set_invoice, only: [:show]

  # GET /purchase_orders/1
  # GET /purchase_orders/1.json
  def show
    respond_to do |format|
      format.html
      format.pdf do
        render  pdf:         "Purchase Order #{@purchase_order.slug}",
                layout:      "pdf",
                disposition: "attachment",
                page_size:   "Letter"
      end
    end
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_purchase_order
    @purchase_order = @vendor.purchase_orders.friendly.find(params[:id])
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def purchase_order_params
    params.require(:purchase_order).permit(:vendor_id, :invoice_id, :number, :date_needed, :blanket, :stock_po, :status, :buyer, :requisition_number, :requested_by, :requested_for, :file_url)
  end

  def set_vendor
    @vendor = @current_org.vendors.friendly.find(params[:vendor_id])
  end

  def set_invoice
    @invoice = @purchase_order.invoice
  end
end
