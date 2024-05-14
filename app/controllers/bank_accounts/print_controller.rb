class BankAccounts::PrintController < ApplicationController
  before_action :set_bank_account

  def show
    @items = BankAccount::ItemSearch.new(scope: @bank_account.items, filters: bank_account_filter_params.dig("filter")).results.distinct.order(:number, :date)
    @start_date = @filter.dig(:filter, :start_date)&.present? ? @filter.dig(:filter, :start_date) : nil
    @end_date   = @filter.dig(:filter, :end_date)&.present?   ? @filter.dig(:filter, :end_date)   : nil

    @fund_codes = @items.inject [] do|accum, bank_item|
      item_codes = bank_item.entry_items_by_fund_code.keys
      [*accum, *item_codes].uniq
    end

    respond_to do |format|
      format.html { render print_view }
      format.pdf do
        render  pdf:         @bank_account.slug,
                template:    "bank_accounts/print/#{print_view}",
                layout:      "print",
                disposition: "attachment",
                orientation: "Landscape",
                header: { right: "[page] of [topage]" },
                page_size:   "Letter"
      end
      format.xlsx do
        render xlsx: print_view
      end
    end
  end

  private

  def set_bank_account
    @bank_account = @current_org.bank_accounts.friendly.find(params[:bank_account_id])
  end

  def bank_account_filter_params
    @filter = JSON.parse(params[:filter]).keep_if {|_k, v| v.present? }.with_indifferent_access
  end

  def print_view
    bank_account_filter_params.dig(:ui, :ledgerView)
  end
end
