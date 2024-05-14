class FilesController < ApplicationController
  def menu
    if @current_org.nil? and !@current_user.ap?
      authorize :admin
    end

    render layout: "application_minimal"
  end

  def new
    if @current_org.nil? and !@current_user.ap?
      authorize :admin
    end

    render layout: "application"
  end

  def index
    if @current_org.nil? and !@current_user.ap?
      authorize :admin
    end

    render layout: "application_minimal"
  end
end
