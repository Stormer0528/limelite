class AccountYearsController < ApplicationController
  before_action :set_accounts_and_elements
  before_action :set_account_year, only: [:show, :edit, :update, :destroy]

  # GET /account_years
  # GET /account_years.json
  def index
    authorize @account_years
  end

  # GET /account_years/1
  # GET /account_years/1.json
  def show
    authorize @account_year
  end

  # GET /account_years/new
  def new
    @account_year =  @current_org.account_years.new
    authorize @account_year
  end

  # GET /account_years/1/edit
  def edit
    authorize @account_year
  end

  # POST /account_years
  # POST /account_years.json
  def create
    @account_year = @current_org.account_years.new(account_year_params)
    authorize @account_year

    respond_to do |format|
      if @account_year.save
        format.html { redirect_to account_years_url, notice: "Account year was successfully created." }
        format.json { render :show, status: :created, location: @account_year }
      else
        format.html { render :new }
        format.json { render json: @account_year.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /account_years/1
  # PATCH/PUT /account_years/1.json
  def update
    authorize @account_year

    respond_to do |format|
      if @account_year.update(account_year_params)
        format.html { redirect_to account_years_url, notice: "Account year was successfully updated." }
        format.json { render :show, status: :ok, location: @account_year }
      else
        format.html { render :edit }
        format.json { render json: @account_year.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /account_years/1
  # DELETE /account_years/1.json
  def destroy
    authorize @account_year

    @account_year.destroy
    respond_to do |format|
      format.html { redirect_to account_years_url, notice: "Account year was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_account_year
    @account_year = @current_org.account_years.friendly.find(params[:id])
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def account_year_params
    params.require(:account_year).permit(:id, :name, :code, :organization_id)
  end
end
