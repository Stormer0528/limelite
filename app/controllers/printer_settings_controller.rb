class PrinterSettingsController < ApplicationController
  before_action :set_printer_setting, only: %i[show edit update destroy]

  # GET /printer_settings
  # GET /printer_settings.json
  def index
    @printer_settings = @current_org.printer_settings.all
  end

  # GET /printer_settings/1
  # GET /printer_settings/1.json
  def show; end

  # GET /printer_settings/new
  def new
    @printer_setting = @current_org.printer_settings.new
  end

  # GET /printer_settings/1/edit
  def edit; end

  # POST /printer_settings
  # POST /printer_settings.json
  def create
    @printer_setting = @current_org.printer_settings.new(printer_setting_params)

    respond_to do |format|
      if @printer_setting.save
        format.html { redirect_to @printer_setting, notice: "Printer setting was successfully created." }
        format.json { render :show, status: :created, location: @printer_setting }
      else
        format.html { render :new }
        format.json { render json: @printer_setting.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /printer_settings/1
  # PATCH/PUT /printer_settings/1.json
  def update
    respond_to do |format|
      if @printer_setting.update(printer_setting_params)
        format.html { redirect_to @printer_setting, notice: "Printer setting was successfully updated." }
        format.json { render :show, status: :ok, location: @printer_setting }
      else
        format.html { render :edit }
        format.json { render json: @printer_setting.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /printer_settings/1
  # DELETE /printer_settings/1.json
  def destroy
    @printer_setting.destroy
    respond_to do |format|
      format.html { redirect_to printer_settings_url, notice: "Printer setting was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_printer_setting
    @printer_setting = @current_org.printer_settings.find(params[:id])
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def printer_setting_params
    params.require(:printer_setting).permit(
      :name, :printer_type, :payee_offset_x, :payee_offset_y, :date_offset_x,
      :date_offset_y, :amount_offset_x, :amount_offset_y, :memo_offset_x,
      :memo_offset_y, :signature_offset_x, :signature_offset_y,
      :amount_text_offset_x, :amount_text_offset_y,
      :micr_offset_x, :micr_offset_y, :check_margin, :direction,
      :voucher1_offset_y, :voucher2_offset_y, :invoice_no_x, :invoice_no_y, :invoice_date_x, :invoice_date_y, :invoice_amount_x, :invoice_amount_y, :invoice_amount_paid_x, :invoice_amount_paid_y, :invoice_description_x, :invoice_description_y
    )
  end
end
