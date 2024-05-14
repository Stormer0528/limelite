class AccountResourcesController < ApplicationController
  before_action :set_accounts_and_elements
  before_action :set_account_resource, only: [:show, :edit, :update, :destroy]

  # GET /account_resources
  # GET /account_resources.json
  def index
    authorize @account_resources
  end

  # GET /account_resources/1
  # GET /account_resources/1.json
  def show
    authorize @account_resource
  end

  # GET /account_resources/new
  def new
    @account_resource =  @current_org.account_resources.new
    authorize @account_resource
  end

  # GET /account_resources/1/edit
  def edit
    authorize @account_resource
  end

  # POST /account_resources
  # POST /account_resources.json
  def create
    @account_resource = @current_org.account_resources.new(account_resource_params)
    authorize @account_resource

    respond_to do |format|
      if @account_resource.save
        format.html { redirect_to account_resources_url, notice: "Account resource was successfully created." }
        format.json { render :show, status: :created, location: @account_resource }
      else
        format.html { render :new }
        format.json { render json: @account_resource.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /account_resources/1
  # PATCH/PUT /account_resources/1.json
  def update
    authorize @account_resource
    respond_to do |format|
      if @account_resource.update(account_resource_params)
        format.html { redirect_to account_resources_url, notice: "Account resource was successfully updated." }
        format.json { render :show, status: :ok, location: @account_resource }
      else
        format.html { render :edit }
        format.json { render json: @account_resource.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /account_resources/1
  # DELETE /account_resources/1.json
  def destroy
    authorize @account_resource
    @account_resource.destroy
    respond_to do |format|
      format.html { redirect_to account_resources_url, notice: "Account resource was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_account_resource
    @account_resource = @current_org.account_resources.friendly.find(params[:id])
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def account_resource_params
    params.require(:account_resource).permit(:id, :name, :code, :organization_id, :restricted)
  end
end
