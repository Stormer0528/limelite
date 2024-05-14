class BankAccountsController < ApplicationController
  before_action :set_bank_account, only: %i[edit update destroy]

  # GET /bank_accounts
  # GET /bank_accounts.json
  def index
    @bank_account_for_auth = @current_org.bank_accounts.first_or_initialize
    authorize @bank_account_for_auth
  end

  # GET /bank_accounts/1
  # GET /bank_accounts/1.json
  # Handled in #index by react router
  # def show
  #   @items
  # end

  # GET /bank_accounts/new
  def new
    @bank_account = @current_org.bank_accounts.new
    authorize @bank_account
    @available_orgs = if @current_user.super_admin?
                        Organization.all
                      else
                        [@current_user.owned_organizations, @current_user.editable_organizations].flatten.uniq
                      end
    @account_objects = @current_org.account_objects.order(:code)
  end

  # GET /bank_accounts/1/edit
  def edit
    authorize @bank_account
    @account_objects = @current_org.account_objects.order(:code)
  end

  # POST /bank_accounts
  # POST /bank_accounts.json
  def create
    @bank_account = @current_org.bank_accounts.new(bank_account_params)
    authorize @bank_account

    respond_to do |format|
      if @bank_account.save
        format.html { redirect_to @bank_account, notice: "Bank account was successfully created." }
        format.json { render :show, status: :created, location: @bank_account }
      else
        format.html { render :new }
        format.json { render json: @bank_account.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /bank_accounts/1
  # PATCH/PUT /bank_accounts/1.json
  def update
    authorize @bank_account

    respond_to do |format|
      if @bank_account.update(bank_account_params)
        format.html { redirect_to @bank_account, notice: "Bank account was successfully updated." }
        format.json { render :show, status: :ok, location: @bank_account }
      else
        format.html { render :edit }
        format.json { render json: @bank_account.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /bank_accounts/1
  # DELETE /bank_accounts/1.json
  def destroy
    authorize @bank_account

    @bank_account.destroy
    respond_to do |format|
      format.html { redirect_to bank_accounts_url, notice: "Bank account was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_bank_account
    @bank_account = @current_org.bank_accounts.friendly.find(params[:id])
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def bank_account_params
    params.require(:bank_account)
      .permit(:pseudo, :number, :name, :description, :account_id,
              :routing_number, :bank_name, :fractional_number,
              :started_at, :ended_at, :edp_number, :state_account_number,
              :organization_id, :starting_balance, :account_object_id)
  end
end
