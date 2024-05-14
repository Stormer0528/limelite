# Show info for current user
class UserController < ApplicationController
  respond_to :json, :text
  before_action :check_logged_in, only: [:show]

  def show
    # render layout: "application_minimal"
  end

  def logged_in
    respond_with do |format|
      format.json do
        render json: {logged_in: @current_user ? true : false}
      end

      format.html do
        render body: @current_user ? "LOGGED IN" : "LOGGED OUT"
      end
    end
  end

  def check_logged_in
    redirect_to(root_path) unless @current_user
  end
end
