class EntriesController < ApplicationController
  include LoggableController

  before_action :set_accounts_and_elements
  before_action :set_entry, only: %i[show edit update destroy]

  # GET /entries
  # GET /entries.json
  def index
    authorize :entry, :index?
    # @entries = @current_org.entries.order(:date).first(15)
  end

  # GET /entries/1
  # GET /entries/1.json
  def show
    authorize @entry
  end

  # GET /entries/new
  def new
    @entry = @current_org.entries.new(creator: @current_user, date: Date.today)
    authorize @entry
    @entry.entry_items.build
  end

  # GET /entries/1/edit
  def edit
    authorize @entry
    @entry.entry_items.standard_ordering
  end

  # POST /entries
  # POST /entries.json
  def create
    @entry = @current_org.entries.new(new_entry_params.merge(creator: @current_user))

    authorize @entry

    respond_to do |format|
      if @entry.valid? && update_state(@entry)
        format.html { redirect_to @entry, notice: "Journal entry was successfully created." }
        format.json { render :show, status: :created, location: @entry }
      else
        format.html { render :new }
        format.json { render json: @entry.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /entries/1
  # PATCH/PUT /entries/1.json
  def update
    authorize @entry

    if entry_params.dig(:entry_attributes, :entry_items_attributes)

      # Remove Entry Items that are deleted
      orig_item_ids = @entry.entry_items.map {|item| item.id.to_s }
      new_item_ids = entry_params.dig(:entry_attributes, :entry_items_attributes).values.map {|v| v["id"] }.compact
      delete_item_ids = orig_item_ids - new_item_ids
      @entry.entry_items.each do |item|
        item.mark_for_destruction if delete_item_ids.include?(item.id.to_s)
      end
    end

    @entry.assign_attributes(entry_params.dig(:entry_attributes) || {})

    respond_to do |format|
      if @entry.valid? && update_state(@entry)
        format.html { redirect_to @entry, notice: "Journal entry was successfully updated." }
        format.json { render :show, status: :ok, location: @entry }
      else
        format.html { render :edit }
        format.json { render json: @entry.errors, status: :unprocessable_entity }
      end
    end
  end

  def duplicate
    @old_entry = @current_org.entries.find(params[:entry_id])
    authorize @old_entry, :create?

    @entry = @old_entry.dup
    @entry.assign_attributes journalable_type: nil, journalable_id: nil, aasm_state: :draft

    @old_entry.entry_items.each do |ei|
      new_entry_item = ei.dup
      new_entry_item.assign_attributes payable_type: nil, payable_id: nil
      @entry.entry_items << new_entry_item
    end
  end

  # DELETE /entries/1
  # DELETE /entries/1.json
  def destroy
    authorize @entry

    @entry.destroy
    respond_to do |format|
      format.html { redirect_to accounts_url, notice: "Entry was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_entry
    @entry = @current_org.entries.includes(entry_items: [:account]).find(params[:id])
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def entry_params
    params.require(:entry)
          .permit(
            entry_attributes: [
              :id, :date, :organization_id, :creator_id, :entry_type, :file_url,
              {entry_items_attributes: %i[id type amount memo amount_in_cents amount_currency account_id payable_type payable_id]}
            ]
          )
  end

  def new_entry_params
    params.require(:entry).require(:entry_attributes)
          .permit(
            :id, :date, :organization_id, :creator_id, :entry_type, :file_url,
            entry_items_attributes: %i[id type amount memo amount_in_cents amount_currency account_id payable_type payable_id]
          )
  end
end
