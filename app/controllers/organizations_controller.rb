class OrganizationsController < ApplicationController
  before_action :set_organization, only: [:show, :edit, :update, :destroy]

  # GET /organizations
  # GET /organizations.json
  def index
    @organizations = policy_scope(Organization).order(:name)
  end

  # GET /organizations/1
  # GET /organizations/1.json
  def show
    authorize @organization
  end

  # GET /organizations/new
  def new
    @organization = Organization.new
    authorize @organization
    @organization.addresses.build if @organization.addresses.empty?

  end

  # GET /organizations/1/edit
  def edit
    authorize @organization
    @organization.addresses.build if @organization.addresses.empty?

  end

  # POST /organizations
  # POST /organizations.json
  def create
    @organization = Organization.new(organization_params)
    authorize @organization

    @organization.addresses.build if @organization.addresses.empty?

    respond_to do |format|
      if @organization.save
        format.html { redirect_to @organization, notice: 'Organization was successfully created.' }
        format.json { render :show, status: :created, location: @organization }
      else
        format.html { render :new }
        format.json { render json: @organization.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /organizations/1
  # PATCH/PUT /organizations/1.json
  def update
    authorize @organization
    respond_to do |format|
      if @organization.update(organization_params)
        format.html { redirect_to @organization, notice: 'Organization was successfully updated.' }
        format.json { render :show, status: :ok, location: @organization }
      else
        format.html { render :edit }
        format.json { render json: @organization.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /organizations/1
  # DELETE /organizations/1.json
  def destroy
    authorize @organization

    @organization.update(archived: true)
    respond_to do |format|
      format.html { redirect_to organizations_url, notice: 'Organization was successfully archived.' }
      format.json { head :no_content }
    end
  end

  private
  # Use callbacks to share common setup or constraints between actions.
  def set_organization
    @organization = Organization.friendly.find(params[:id])
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def organization_params
    params.require(:organization).permit(
      :name, :description, :email, :phone, :subdomain, :archived, :alias,
      {addresses_attributes: %i[_destroy id name attention department line1 line2 city state zip]},
    )
  end
end
