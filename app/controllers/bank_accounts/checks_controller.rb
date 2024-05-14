class BankAccounts::ChecksController < ApplicationController
  include LoggableController

  before_action :set_accounts_and_elements, except: %i[show]
  before_action :set_bank_account
  before_action :set_check, only: %i[edit update destroy show]

  # GET /checks/new
  def new
    @check = @bank_account.checks.new(date: Date.today, creator: @current_user)
    authorize @check

    @check.build_entry(creator: @current_user, organization: @current_org,
                       date: Date.today)
    @vendors = @current_org.vendors.order({company: :asc}, {first_name: :asc})
  end

  def show
    authorize @check
  end

  # GET /checks/1/edit
  def edit
    authorize @check

    @vendors = @current_org.vendors.order({company: :asc}, {first_name: :asc})
    @addresses = @check.vendor ? @check.vendor.addresses : []
  end

  # POST /checks
  # POST /checks.json
  def create
    @check = @bank_account.checks.new(creator_id: @current_user.id)
    authorize @check

    @check.build_entry(creator: @current_user, organization: @current_org)
    @check.assign_attributes check_params

    respond_to do |format|
      if @check.valid? && update_state(@check)
        format.html { redirect_to @bank_account, notice: "Check was successfully created." }
        format.json { render :show, status: :created, location: [@bank_account, @check] }
      else
        format.html { render :new }
        format.json { render json: @check.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /checks/1
  # PATCH/PUT /checks/1.json
  def update
    authorize @check

    unless commit_type == "Void"

      # This is for manual checks only
      if @check.entry && check_params.dig(:entry_attributes, :entry_items_attributes)

        # Remove Entry Items that are deleted
        orig_item_ids = @check.entry.entry_items.map{|item| item.id.to_s}
        new_item_ids = check_params.dig(:entry_attributes, :entry_items_attributes).values.map {|v| v["id"] if v["id"] }.compact
        delete_item_ids = orig_item_ids - new_item_ids

        @check.entry.entry_items.each do |item|
          item.mark_for_destruction if delete_item_ids.include?(item.id.to_s)
        end
      end

      @check.assign_attributes(check_params)
    end

    respond_to do |format|
      if @check.valid? && update_state(@check)
        format.html { redirect_to @bank_account, notice: "Check was successfully updated." }
        format.json { render :show, status: :ok, location: [@bank_account, @check] }
      else
        format.html { render :edit }
        format.json { render json: @check.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /checks/1
  # DELETE /checks/1.json
  def destroy
    authorize @check

    @check.destroy
    respond_to do |format|
      format.html { redirect_to @bank_account, notice: "Check was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_check
    @check = @bank_account.checks.find(params[:id])
  end

  def set_bank_account
    @bank_account = @current_org.bank_accounts.friendly.find(params[:bank_account_id])
  end

  def commit_type
    params.require(:commit)
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def check_params
    params.require(:bank_account_check).permit(
      :amount, :date, :memo, :creator_id, :vendor_id, :file_url, :number, :check_type,
      :address_id, :invoice_id, entry_attributes: [
        :id, :date, :entry_type, :file_url,
        {entry_items_attributes: [:id, :account_id, :amount, :type, :payable_type, :payable_id, :memo]}
      ]
    )
  end
end
