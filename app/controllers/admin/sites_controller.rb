class Admin::SitesController < ApplicationController
  before_action :set_site, only: %i[show edit update destroy]
  before_action :set_school, only: %i[show edit update destroy]

  # after_action :verify_authorized
  # after_action :verify_policy_scoped, only: :index

  # GET /sites
  # GET /sites.json
  def index
    # authorize :admin_sites, :index?
    @sites = Organization.all
  end

  # GET /sites/1
  # GET /sites/1.json
  def show
    authorize :admin_sites, :show?
  end

  # GET /sites/new
  def new
    authorize :admin_sites, :new?
    @school = School.new
    @site = @school.build_site
    @address = @school.build_address
  end

  # GET /sites/1/edit
  def edit
    authorize :admin_sites, :edit?
  end

  # POST /sites
  # POST /sites.json
  def create
    authorize :admin_sites, :create?
    @school = School.new(school_params)

    respond_to do |format|
      if @school.save
        format.html { redirect_to admin_sites_path, notice: "Site was successfully created." }
        format.json { render :show, status: :created, location: @school }
      else
        format.html { render :new }
        format.json { render json: @school.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /sites/1
  # PATCH/PUT /sites/1.json
  def update
    authorize :admin_sites, :update?
    respond_to do |format|
      if @school.update(school_params)
        format.html { redirect_to admin_site_path(@school.site), notice: "Site was successfully updated." }
        format.json { render :show, status: :ok, location: admin_site_path(@school.site) }
      else
        format.html { render :edit }
        format.json { render json: @school.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /sites/1
  # DELETE /sites/1.json
  def destroy
    authorize :admin_sites, :destroy?

    @site.destroy
    respond_to do |format|
      format.html { redirect_to admin_sites_url, notice: "Site was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  def set_current_site
    @site
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_school
    @school = @site.school
  end

  def set_site
    @site = Site.friendly.find(params[:id])
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def school_params
    params.require(:school).permit(
      :name, :email, :phone,
      {site_attributes: [:sub_domain]}, address_attributes: %i[line1 line2 city state zip]
    )
  end
end
