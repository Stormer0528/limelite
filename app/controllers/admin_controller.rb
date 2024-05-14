class AdminController < ApplicationController
  after_action :verify_authorized, only: [:index]
  def index
    authorize :admin, :index?
  end
end
