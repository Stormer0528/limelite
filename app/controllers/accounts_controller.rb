class AccountsController < ApplicationController
  before_action :set_accounts_and_elements
  before_action :set_account, only: %i[show edit update destroy]

  # GET /accounts
  # GET /accounts.json
  def index
    authorize :account, :index?
  end

  # GET /accounts/1
  # GET /accounts/1.json
  def show
    authorize @account
    @entry_items = @account.entry_items
  end

  # GET /accounts/1/edit
  def edit
    authorize @account
    @account.budgets.new if @account.budgets.count.zero?
    set_fiscal_years
  end

  # PATCH/PUT /accounts/1
  # PATCH/PUT /accounts/1.json
  def update
    authorize @account

    respond_to do |format|
      if @account.update(account_params)
        format.html { redirect_to @account, notice: "Account was successfully updated." }
        format.json { render :show, status: :ok, location: @account }
      else
        format.html { render :edit }
        format.json { render json: @account.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /accounts/1
  # DELETE /accounts/1.json
  def destroy
    authorize @account

    @account.destroy
    respond_to do |format|
      format.html { redirect_to accounts_url, notice: "Account was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_account
    @account = @current_org.accounts.friendly.find(params[:id])
  end

  def set_fiscal_years
    @fiscal_years = (
      @current_org.earliest_fiscal_year.year..@current_org.next_fiscal_year.year
    ).map do |year|
      [ "#{year}-#{(year + 1).to_s[2,2]}" , year]
    end
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def account_params
    params.require(:account).permit(
      :organization_id, :pseudo, :name, :owner, :description,
      :state_account_number, :restriced,
      budgets_attributes: [:id, :fiscal_year, :amount, :amount_in_cents, :_destroy]
    )
  end
end
