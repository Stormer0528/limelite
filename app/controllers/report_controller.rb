class ReportController < ApplicationController
  def index
    authorize :report, :index?
    respond_to do |format|
      format.html { render "report/index", layout: "application_no_breadcrumb" }
    end
  end
end
