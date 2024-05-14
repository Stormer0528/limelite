class AccountObjectsController < ApplicationController
  before_action :set_accounts_and_elements
  before_action :set_account_object, only: [:show, :edit, :update, :destroy]

  # GET /account_objects
  # GET /account_objects.json
  def index
    authorize @account_objects
  end

  # GET /account_objects/1
  # GET /account_objects/1.json
  def show
    authorize @account_object
  end

  # GET /account_objects/new
  def new
    @account_object = @current_org.account_objects.new
    authorize @account_object
  end

  # GET /account_objects/1/edit
  def edit
    authorize @account_object
  end

  # POST /account_objects
  # POST /account_objects.json
  def create
    @account_object = @current_org.account_objects.new(account_object_params)
    authorize @account_object

    respond_to do |format|
      if @account_object.save
        format.html { redirect_to account_objects_url, notice: "Account object was successfully created." }
        format.json { render :show, status: :created, location: @account_object }
      else
        format.html { render :new }
        format.json { render json: @account_object.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /account_objects/1
  # PATCH/PUT /account_objects/1.json
  def update
    authorize @account_object

    respond_to do |format|
      if @account_object.update(account_object_params)
        format.html { redirect_to account_objects_url, notice: "Account object was successfully updated." }
        format.json { render :show, status: :ok, location: @account_object }
      else
        format.html { render :edit }
        format.json { render json: @account_object.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /account_objects/1
  # DELETE /account_objects/1.json
  def destroy
    authorize @account_object

    @account_object.destroy
    respond_to do |format|
      format.html { redirect_to account_objects_url, notice: "Account object was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_account_object
    @account_object = @current_org.account_objects.friendly.find(params[:id])
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def account_object_params
    params.require(:account_object).permit(:id, :name, :code, :rollup, :normal_balance,
                                           :object_type, :organization_id)
  end
end
