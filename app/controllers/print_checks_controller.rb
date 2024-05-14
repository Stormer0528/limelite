class PrintChecksController < ApplicationController

  def print
    set_bank_account

    authorize :bank_account, :edit?
    set_printer_setting
    get_checks
    update_numbers
    sort_checks

    respond_to do |format|
      format.html { render layout: "pdf" }
      format.pdf do
        render  pdf:       @printer_settings.printer_type,
                layout:    "pdf",
                page_size: "Letter",
                margin:    {
                  top:    0, # default 10 (mm)
                  bottom: 0,
                  left:   0,
                  right:  0
                }
      end
    end
  end

  private

  def set_bank_account
    @bank_account = @current_org.bank_accounts.friendly.find(params[:bank_account_id])
  end

  def set_printer_setting
    @printer_settings = PrinterSetting.find(print_config_params[:printer_setting_id])
  end

  def update_numbers
    print_config_params[:items].each do |item|
      check = @checks.find { |check| check.id.to_i == item[:id].to_i }

      if !check.nil?
        check.update(number: item[:number])
      end
    end
  end

  def get_checks
    ids = print_config_params[:items].map {|item| item[:id]}
    @checks = @bank_account.checks.where(id: ids)
  end

  def sort_checks
    @checks = @checks.order("bank_account_items.number #{@printer_settings.direction}")
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def print_config_params
    params.require(:config).permit(:printer_setting_id, :starting_check_number,
                                   items: [:on, :id, :number])
  end
end
