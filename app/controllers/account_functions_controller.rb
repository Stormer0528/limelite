class AccountFunctionsController < ApplicationController
  before_action :set_accounts_and_elements
  before_action :set_account_function, only: [:show, :edit, :update, :destroy]

  # GET /account_functions
  # GET /account_functions.json
  def index
    authorize @account_functions
  end

  # GET /account_functions/1
  # GET /account_functions/1.json
  def show
    authorize @account_function
  end

  # GET /account_functions/new
  def new
    @account_function = @current_org.account_functions.new
    authorize @account_function
  end

  # GET /account_functions/1/edit
  def edit
    authorize @account_function
  end

  # POST /account_functions
  # POST /account_functions.json
  def create
    @account_function = @current_org.account_functions.new(account_function_params)
    authorize @account_function

    respond_to do |format|
      if @account_function.save
        format.html { redirect_to account_functions_url, notice: "Account function was successfully created." }
        format.json { render :show, status: :created, location: @account_function }
      else
        format.html { render :new }
        format.json { render json: @account_function.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /account_functions/1
  # PATCH/PUT /account_functions/1.json
  def update
    authorize @account_function

    respond_to do |format|
      if @account_function.update(account_function_params)
        format.html { redirect_to account_functions_url, notice: "Account function was successfully updated." }
        format.json { render :show, status: :ok, location: @account_function }
      else
        format.html { render :edit }
        format.json { render json: @account_function.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /account_functions/1
  # DELETE /account_functions/1.json
  def destroy
    authorize @account_function

    @account_function.destroy
    respond_to do |format|
      format.html { redirect_to account_functions_url, notice: "Account function was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_account_function
    @account_function = @current_org.account_functions.friendly.find(params[:id])
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def account_function_params
    params.require(:account_function).permit(:id, :name, :code, :organization_id)
  end
end
