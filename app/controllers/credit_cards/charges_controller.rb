class CreditCards::ChargesController < ApplicationController
  include LoggableController

  before_action :set_accounts_and_elements, except: %i[show]
  before_action :set_credit_card
  before_action :set_credit_card_charge, only: %i[edit update destroy show]

  # GET /credit_card_charges/new
  def new
    @credit_card_charge = @credit_card.charges.new(date: Date.today, creator: @current_user)
    authorize @credit_card_charge

    @credit_card_charge.build_entry(creator: @current_user, organization: @current_org,
                       date: Date.today, entry_type: "Payment")
    @vendors = @current_org.vendors.order({company: :asc}, {first_name: :asc})
  end


  def show
    authorize @credit_card_charge
  end

  # GET /credit_card_charges/1/edit
  def edit
    authorize @credit_card_charge

    @vendors = @current_org.vendors.order({company: :asc}, {first_name: :asc})
    @addresses = @credit_card_charge.vendor ? @credit_card_charge.vendor.addresses : []
  end

  # POST /credit_card_charges
  # POST /credit_card_charges.json
  def create
    @credit_card_charge = @credit_card.charges.new(creator: @current_user)
    authorize @credit_card_charge

    @credit_card_charge.build_entry(creator: @current_user, organization: @current_org, entry_type: "Payment")
    @credit_card_charge.assign_attributes(credit_card_charge_params)

    respond_to do |format|
      if @credit_card_charge.valid? && update_state(@credit_card_charge)
        format.html { redirect_to @credit_card, notice: "Credit Card Charge was successfully created." }
        format.json { render :show, status: :created, location: @credit_card }
      else
        format.html { render :new }
        format.json { render json: @credit_card_charge.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /credit_card_charges/1
  # PATCH/PUT /credit_card_charges/1.json
  def update
    authorize @credit_card_charge

    unless @credit_card_charge.entry
      @credit_card_charge.build_entry(creator: @current_user, organization: @current_org)
    end

    if @credit_card_charge.entry && credit_card_charge_params.dig(:entry_attributes, :entry_items_attributes)
      # Remove Entry Items that are deleted
      orig_item_ids = @credit_card_charge.entry.entry_items.map{|item| item.id.to_s}
      new_item_ids = credit_card_charge_params.dig(:entry_attributes, :entry_items_attributes).values.map {|v| v["id"] if v["id"] }.compact
      delete_item_ids = orig_item_ids - new_item_ids
      @credit_card_charge.entry_items.each do |item|
        item.mark_for_destruction if delete_item_ids.include?(item.id.to_s)
      end
    end
    @credit_card_charge.assign_attributes(credit_card_charge_params)

    respond_to do |format|
      if @credit_card_charge.valid? && update_state(@credit_card_charge)
        format.html { redirect_to @credit_card, notice: "Credit Card Charge was successfully updated." }
      else
        format.html { render :edit }
      end
    end
  end

  # DELETE /credit_card_charges/1
  # DELETE /credit_card_charges/1.json
  def destroy
    authorize @credit_card_charge

    @credit_card_charge.destroy
    respond_to do |format|
      format.html { redirect_to credit_card_charges_url, notice: "Credit Card Charge was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private
  def set_credit_card
    @credit_card = @current_org.credit_cards.friendly.find(params[:credit_card_id])
  end

  def set_credit_card_charge
    @credit_card_charge = @credit_card.charges.find(params[:id])
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def credit_card_charge_params
    params.require(:credit_card_charge).permit(
      :credit_card_id, :amount, :vendor_id, :date, :memo,
      entry_attributes: [
        :id, :date, :entry_type, :file_url,
        {entry_items_attributes: [:id, :account_id, :amount, :type, :payable_type, :payable_id, :memo]}
      ]
    )
  end
end
