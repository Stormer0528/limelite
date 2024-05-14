class AccountLocationsController < ApplicationController
  before_action :set_accounts_and_elements
  before_action :set_account_location, only: [:show, :edit, :update, :destroy]

  # GET /account_locations
  # GET /account_locations.json
  def index
    authorize @account_locations
  end

  # GET /account_locations/1
  # GET /account_locations/1.json
  def show
    authorize @account_location
  end

  # GET /account_locations/new
  def new
    @account_location = @current_org.account_locations.new
    authorize @account_location
  end

  # GET /account_locations/1/edit
  def edit
    authorize @account_location
  end

  # POST /account_locations
  # POST /account_locations.json
  def create
    @account_location = @current_org.account_locations.new(account_location_params)
    authorize @account_location

    respond_to do |format|
      if @account_location.save
        format.html { redirect_to account_locations_url, notice: "Account location was successfully created." }
        format.json { render :show, status: :created, location: @account_location }
      else
        format.html { render :new }
        format.json { render json: @account_location.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /account_locations/1
  # PATCH/PUT /account_locations/1.json
  def update
    authorize @account_location

    respond_to do |format|
      if @account_location.update(account_location_params)
        format.html { redirect_to account_locations_url, notice: "Account location was successfully updated." }
        format.json { render :show, status: :ok, location: @account_location }
      else
        format.html { render :edit }
        format.json { render json: @account_location.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /account_locations/1
  # DELETE /account_locations/1.json
  def destroy
    authorize @account_location
    @account_location.destroy
    respond_to do |format|
      format.html { redirect_to account_locations_url, notice: "Account location was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_account_location
    @account_location = @current_org.account_locations.friendly.find(params[:id])
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def account_location_params
    params.require(:account_location).permit(:id, :name, :code, :organization_id)
  end
end
