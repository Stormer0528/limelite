class FilesController < ApplicationController
  def menu
    authorize :file, :view?
    render layout: "application_minimal"
  end

  def new
    authorize :file, :create?
    render layout: "application"
  end

  def index
    authorize :file, :view?
    render layout: "application_minimal"
  end  
end