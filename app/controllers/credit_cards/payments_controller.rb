class CreditCards::PaymentsController < ApplicationController
  include LoggableController

  before_action :set_accounts_and_elements
  before_action :set_credit_card
  before_action :set_credit_card_payment, only: %i[edit update destroy show]

  # GET /credit_card/payments/new
  def new
    @payment = @credit_card.payments.new(date: Date.today, creator: @current_user)
    authorize @payment

    @payment.build_entry(creator: @current_user, organization: @current_org, date: Date.today)
  end

  # GET /credit_card/payments/1/edit
  def edit
    authorize @payment
  end

  # POST /credit_card/payments
  # POST /credit_card/payments.json
  def create
    @payment = @credit_card.payments.new(creator: @current_user)
    authorize @payment

    @payment.build_entry(creator: @current_user, organization: @current_org)
    @payment.assign_attributes(credit_card_payment_params)

    respond_to do |format|
      if @payment.valid? && update_state(@payment)
        format.html { redirect_to @credit_card, notice: "Payment was successfully created." }
        format.json { render :show, status: :created, location: @credit_card }
      else
        format.html { render :new }
        format.json { render json: @payment.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /credit_card/payments/1
  # PATCH/PUT /credit_card/payments/1.json
  def update
    authorize @payment

    if @payment.entry && credit_card_payment_params.dig(:entry_attributes, :entry_items_attributes)
      # Remove Entry Items that are deleted
      orig_item_ids = @payment.entry.entry_items.map{|item| item.id.to_s}
      new_item_ids = credit_card_payment_params.dig(:entry_attributes, :entry_items_attributes).values.map {|v| v["id"] if v["id"] }.compact
      delete_item_ids = orig_item_ids - new_item_ids
      @payment.entry_items.each do |item|
        item.mark_for_destruction if delete_item_ids.include?(item.id.to_s)
      end
    end

    @payment.assign_attributes(credit_card_payment_params)

    respond_to do |format|
      if @payment.valid? && update_state(@payment)
        format.html { redirect_to @credit_card, notice: "Payment was successfully updated." }
      else
        format.html { render :edit }
      end
    end
  end

  # DELETE /credit_card/payments/1
  # DELETE /credit_card/payments/1.json
  def destroy
    authorize @payment

    @payment.destroy
    respond_to do |format|
      format.html { redirect_to @credit_card, notice: "Payment was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private
  def set_credit_card
    @credit_card = @current_org.credit_cards.friendly.find(params[:credit_card_id])
  end

  def set_credit_card_payment
    @payment = @credit_card.payments.find(params[:id])
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def credit_card_payment_params
    params.require(:credit_card_payment).permit(:credit_card_id, :amount, :date, :memo,
      entry_attributes: [
        :id, :date, :entry_type, :file_url,
        {entry_items_attributes: [:id, :account_id, :amount, :type, :payable_type, :payable_id, :memo]}
      ]
    )
  end
end
