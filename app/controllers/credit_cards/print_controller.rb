class CreditCards::PrintController < ApplicationController
  before_action :set_credit_card

  def show
    @items = CreditCard::ItemSearch.new(scope: @credit_card.items, filters: credit_card_filter_params.dig("filter")).results
    respond_to do |format|
      format.pdf do
        render  pdf:         @credit_card.slug,
                template:    "credit_cards/print/summary",
                layout:      "print",
                disposition: "attachment",
                orientation: "Landscape",
                header: { right: "[page] of [topage]" },
                page_size:   "Letter"
      end
      format.xlsx do
        render xlsx: "summary"
      end
    end
  end

  private

  def set_credit_card
    @credit_card = @current_org.credit_cards.friendly.find(params[:credit_card_id])
  end

  def credit_card_filter_params
    JSON.parse(params[:filter]).keep_if {|_k, v| v.present? }.with_indifferent_access
  end

  def print_view
    credit_card_filter_params.dig(:ui, :ledgerView)
  end
end
