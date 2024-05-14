class Admin::UsersController < ApplicationController
  protect_from_forgery except: [:mass_update]
  before_action :set_user, only: [:show, :edit, :update, :destroy]
  before_action :deduplicate_email, only: [:update]
  before_action :allow_without_password, only: [:update]
  before_action :set_user_role, only: [:update]
  before_action :filter_avatar_url, only: [:update, :create]

  def index
    authorize :admin_users, :index?
    @has_own_navigation = true

    render layout: "application_minimal"
  end

  def show
    authorize :admin_users, :show?
  end

  def new
    authorize :admin_users, :new?
    @user = User.new
  end

  def create
    authorize :admin_users, :create?

    @user = User.archived.find_by(email: user_params[:email]) || User.new
    @user.assign_attributes user_params.except(:organization_role)

    @user.skip_confirmation! if user_params[:confirmed] == "1"

    respond_to do |format|
      if @user.save
        set_user_role
        format.html { redirect_to admin_user_path(@user), notice: "User was successfully created." }
        format.json { render :show, status: :created, location: @user }
      else
        format.html { render :new }
        format.json { render json: @user.errors, status: :unprocessable_entity }
      end
    end
  end

  def edit
    authorize :admin_users, :edit?
  end

  def update
    authorize :admin_users, :update?

    @user.skip_reconfirmation! if @current_user.admin?
    @user.skip_confirmation! if user_params[:confirmed] == "1" && !@user.confirmed?

    respond_to do |format|
      if @user.update(user_params)
        format.html { redirect_to admin_user_path(@user), notice: "User was successfully updated." }
        format.json { render :show, status: :created, location: @user }
      else
        format.html { render :edit }
        format.json { render json: @user.errors, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    authorize :admin_users, :destroy?
    @user.destroy
    respond_to do |format|
      format.html { redirect_to admin_users_url, notice: "User #{@user.full_name} was successfully destroyed." }
      format.json { render json: {user_id: @user.id}, status: 200 }
    end
  end

  private

  def set_user
    @user = User.friendly.find(params[:id])
  end

  def user_params
    params.require(:user).permit(
      :id, :first_name, :last_name, :email, :back_office, :confirmed,
      :avatar_url, :password, :password_confirmation, :organization_role, :ap
    )
  end

  def allow_without_password
    if params[:user][:password].blank? && params[:user][:password_confirmation].blank?
      params[:user].delete(:password)
      params[:user].delete(:password_confirmation)
    end
  end

  def deduplicate_email
    params[:user].delete(:email) if params[:user][:email].blank? || params[:user][:email] == @user.email
  end

  def filter_avatar_url
    params[:user].delete(:avatar_url) if params[:user][:avatar_url] == "undefined"
  end

  def set_user_role
    unless params[:user][:organization_role].blank?
      role = params[:user].delete(:organization_role)
      type = role == "None" ? "viewer" : "editor"
      @user.set_organization_role(@current_org.id, type, role)
    end
  end
end
