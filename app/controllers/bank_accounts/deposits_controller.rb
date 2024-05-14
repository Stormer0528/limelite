class BankAccounts::DepositsController < ApplicationController
  include LoggableController

  before_action :set_accounts_and_elements
  before_action :set_bank_account
  before_action :set_deposit, only: %i[show edit update destroy]

  # GET /deposits/new
  def new
    @deposit = @bank_account.deposits.new(creator: @current_user)
    authorize @deposit

    @deposit.build_entry(creator: @current_user, organization: @current_org, date: Date.today)
  end

  # GET /deposits/1/edit
  def edit
    authorize @deposit
  end

  # POST /deposits
  # POST /deposits.json
  def create
    @deposit = @bank_account.deposits.new(creator_id: @current_user.id)
    authorize @deposit

    @deposit.build_entry(creator: @current_user, organization: @current_org)
    @deposit.assign_attributes deposit_params

    respond_to do |format|
      if update_state(@deposit)
        format.html { redirect_to @bank_account, notice: "Deposit was successfully created." }
        format.json { render :show, status: :created, location: [@bank_account, @deposit] }
      else
        format.html { render :new }
        format.json { render json: @deposit.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /deposits/1
  # PATCH/PUT /deposits/1.json
  def update
    authorize @deposit

    if @deposit.entry && deposit_params.dig(:entry_attributes, :entry_items_attributes)
      # Remove Entry Items that are deleted
      orig_item_ids = @deposit.entry.entry_items.map{|item| item.id.to_s}
      new_item_ids = deposit_params.dig(:entry_attributes, :entry_items_attributes).values.map {|v| v["id"] if v["id"] }.compact
      delete_item_ids = orig_item_ids - new_item_ids

      @deposit.entry.entry_items.each do |item|
        item.mark_for_destruction if delete_item_ids.include?(item.id.to_s)
      end
    end

    @deposit.assign_attributes(deposit_params)

    respond_to do |format|
      if update_state(@deposit)
        format.html { redirect_to @bank_account, notice: "Deposit was successfully updated." }
        format.json { render :show, status: :ok, location: [@bank_account, @deposit] }
      else
        format.html { render :edit }
        format.json { render json: @deposit.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /deposits/1
  # DELETE /deposits/1.json
  def destroy
    authorize @deposit

    @deposit.destroy
    respond_to do |format|
      format.html { redirect_to redirect_to @bank_account, notice: "Deposit was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_deposit
    @deposit = @bank_account.deposits.find(params[:id])
  end

  def set_bank_account
    @bank_account = @current_org.bank_accounts.friendly.find(params[:bank_account_id])
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def deposit_params
    params.require(:bank_account_deposit).permit(
      :amount, :date, :number, :memo, :creator_id, :file_url, entry_attributes: [
        :id, :date, :entry_type, :file_url,
        entry_items_attributes: [ :id, :account_id, :amount, :type, :payable_type, :payable_id, :memo]
      ]
    )
  end
end
