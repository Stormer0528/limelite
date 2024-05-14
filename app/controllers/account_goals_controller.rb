class AccountGoalsController < ApplicationController
  before_action :set_accounts_and_elements
  before_action :set_account_goal, only: [:show, :edit, :update, :destroy]

  # GET /account_goals
  # GET /account_goals.json
  def index
    authorize @account_goals
  end

  # GET /account_goals/1
  # GET /account_goals/1.json
  def show
    authorize @account_goal
  end

  # GET /account_goals/new
  def new
    @account_goal =  @current_org.account_goals.new
    authorize @account_goal
  end

  # GET /account_goals/1/edit
  def edit
    authorize @account_goal
  end

  # POST /account_goals
  # POST /account_goals.json
  def create
    @account_goal = @current_org.account_goals.new(account_goal_params)
    authorize @account_goal

    respond_to do |format|
      if @account_goal.save
        format.html { redirect_to account_goals_url, notice: "Account goal was successfully created." }
        format.json { render :show, status: :created, location: @account_goal }
      else
        format.html { render :new }
        format.json { render json: @account_goal.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /account_goals/1
  # PATCH/PUT /account_goals/1.json
  def update
    authorize @account_goal

    respond_to do |format|
      if @account_goal.update(account_goal_params)
        format.html { redirect_to account_goals_url, notice: "Account goal was successfully updated." }
        format.json { render :show, status: :ok, location: @account_goal }
      else
        format.html { render :edit }
        format.json { render json: @account_goal.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /account_goals/1
  # DELETE /account_goals/1.json
  def destroy
    authorize @account_goal

    @account_goal.destroy
    respond_to do |format|
      format.html { redirect_to account_goals_url, notice: "Account goal was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_account_goal
    @account_goal = @current_org.account_goals.friendly.find(params[:id])
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def account_goal_params
    params.require(:account_goal).permit(:id, :name, :code, :organization_id)
  end
end
