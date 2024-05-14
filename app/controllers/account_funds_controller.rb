class AccountFundsController < ApplicationController
  before_action :set_accounts_and_elements
  before_action :set_account_fund, only: [:show, :edit, :update, :destroy]

  # GET /account_funds
  # GET /account_funds.json
  def index
    authorize @account_funds
  end

  # GET /account_funds/1
  # GET /account_funds/1.json
  def show
    authorize @account_fund
  end

  # GET /account_funds/new
  def new
    @account_fund =  @current_org.account_funds.new
    authorize @account_fund

  end

  # GET /account_funds/1/edit
  def edit
    authorize @account_fund
  end

  # POST /account_funds
  # POST /account_funds.json
  def create
    @account_fund = @current_org.account_funds.new(account_fund_params)
    authorize @account_fund

    respond_to do |format|
      if @account_fund.save
        format.html { redirect_to account_funds_url, notice: "Account fund was successfully created." }
        format.json { render :show, status: :created, location: @account_fund }
      else
        format.html { render :new }
        format.json { render json: @account_fund.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /account_funds/1
  # PATCH/PUT /account_funds/1.json
  def update
    authorize @account_fund

    respond_to do |format|
      if @account_fund.update(account_fund_params)
        format.html { redirect_to account_funds_url, notice: "Account fund was successfully updated." }
        format.json { render :show, status: :ok, location: @account_fund }
      else
        format.html { render :edit }
        format.json { render json: @account_fund.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /account_funds/1
  # DELETE /account_funds/1.json
  def destroy
    authorize @account_fund

    @account_fund.destroy
    respond_to do |format|
      format.html { redirect_to account_funds_url, notice: "Account fund was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_account_fund
    @account_fund = @current_org.account_funds.friendly.find(params[:id])
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def account_fund_params
    params.require(:account_fund).permit(:id, :name, :code, :organization_id)
  end
end
