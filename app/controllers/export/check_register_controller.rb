class Export::CheckRegisterController < ApplicationController
  before_action :set_filter
  before_action :set_bank_account

  def show
    @items = BankAccount::ItemSearch.new(
      scope: @current_org.checks,
      filters: @filter
    ).results
    .order(:number, :date)
    .reject {|i| i.aasm_state == "voided" }.uniq {|i| i.id }

    @start_date = @filter.dig(:start_date)
    @end_date   = @filter.dig(:end_date)

    @fund_codes = @items.inject [] do|accum, bank_item|
      item_codes = bank_item.entry_items_by_fund_code.keys
      [*accum, *item_codes].uniq
    end


    respond_to do |format|
      format.html { render :show }

      format.pdf do
        render  pdf:         "check_register",
                layout:      "pdf",
                disposition: "attachment",
                orientation: "Landscape",
                header: { right: "[page] of [topage]", font_name: "Times New Roman", },
                page_size:   "Letter"
      end

      format.xlsx do
        render xlsx: "show"
        response.headers["Content-Disposition"] = ['attachment; filename="', "CheckRegister.xlsx"].join
      end
    end
  end

  private

  def set_bank_account
    @bank_account = @filter[:bank_account_id] ? @current_org.bank_accounts.find(@filter[:bank_account_id]) : nil
  end

  def set_filter
    @filter = JSON.parse(params.require(:filter)).keep_if {|_k, v| v.present? }.with_indifferent_access
  end
end
