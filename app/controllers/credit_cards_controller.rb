class CreditCardsController < ApplicationController
  before_action :set_credit_card, only: %i[show edit update destroy]

  # GET /credit_cards
  # GET /credit_cards.json
  def index
    @credit_card_for_auth = @current_org.credit_cards.first_or_initialize
    authorize @credit_card_for_auth
  end

  # GET /credit_cards/1
  # GET /credit_cards/1.json
  def show; end

  # GET /credit_cards/new
  def new
    @credit_card = @current_org.credit_cards.new
    authorize @credit_card
  end

  # GET /credit_cards/1/edit
  def edit
    authorize @credit_card
  end

  # POST /credit_cards
  # POST /credit_cards.json
  def create
    @credit_card = @current_org.credit_cards.new(credit_card_params)
    authorize @credit_card

    respond_to do |format|
      if @credit_card.save
        format.html { redirect_to @credit_card, notice: "Credit card account was successfully created." }
        format.json { render :show, status: :created, location: @credit_card }
      else
        format.html { render :new }
        format.json { render json: @credit_card.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /credit_cards/1
  # PATCH/PUT /credit_cards/1.json
  def update
    authorize @credit_card
    respond_to do |format|
      if @credit_card.update(credit_card_params)
        format.html { redirect_to @credit_card, notice: "Credit card account was successfully updated." }
        format.json { render :show, status: :ok, location: @credit_card }
      else
        format.html { render :edit }
        format.json { render json: @credit_card.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /credit_cards/1
  # DELETE /credit_cards/1.json
  def destroy
    authorize @credit_card
    @credit_card.destroy
    respond_to do |format|
      format.html { redirect_to credit_cards_url, notice: "Credit card account was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_credit_card
    @credit_card = @current_org.credit_cards.friendly.find(params[:id])
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def credit_card_params
    params.require(:credit_card).permit(:name, :description, :number, :starting_balance, :started_at, :ended_at)
  end
end
