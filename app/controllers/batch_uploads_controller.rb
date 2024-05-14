class BatchUploadsController < ApplicationController
  before_action :set_batch_upload, only: [:show, :edit, :update, :destroy]

  # GET /batch_uploads
  # GET /batch_uploads.json
  def index
    # @batch_uploads = @current_org.batch_uploads
    # authorize @batch_uploads

    # Debug
    @batch_upload = @current_org.batch_uploads.new
    authorize @batch_upload
  end

  # GET /batch_uploads/1
  # GET /batch_uploads/1.json
  def show
    authorize @batch_upload
  end

  # GET /batch_uploads/new
  def new
    @batch_upload = @current_org.batch_uploads.new
    authorize @batch_upload

    3.times do
      @batch_upload.files.new
    end
  end

  # GET /batch_uploads/1/edit
  def edit
    authorize @batch_upload
  end

  # POST /batch_uploads
  # POST /batch_uploads.json
  def create
    @batch_upload = @current_org.batch_uploads.new(batch_upload_params)
    authorize @batch_upload

    respond_to do |format|
      if @batch_upload.save
        format.html { redirect_to @batch_upload, notice: "Batch upload was successfully created." }
        format.json { render :show, status: :created, location: @batch_upload }
      else
        format.html { render :new }
        format.json { render json: @batch_upload.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /batch_uploads/1
  # PATCH/PUT /batch_uploads/1.json
  def update
    authorize @batch_upload

    respond_to do |format|
      if @batch_upload.update(batch_upload_params)
        format.html { redirect_to @batch_upload, notice: "Batch upload was successfully updated." }
        format.json { render :show, status: :ok, location: @batch_upload }
      else
        format.html { render :edit }
        format.json { render json: @batch_upload.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /batch_uploads/1
  # DELETE /batch_uploads/1.json
  def destroy
    authorize @batch_upload

    @batch_upload.destroy
    respond_to do |format|
      format.html { redirect_to batch_uploads_url, notice: "Batch upload was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_batch_upload
    @batch_upload = @current_org.batch_uploads.find(params[:id])
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def batch_upload_params
    params.require(:batch_upload).permit(:total_invoices, :critical_invoices,
                                         :notes, files_attributes: [:url])
  end
end
