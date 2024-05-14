class Organizations::FiscalYearController < ApplicationController
  def update
    session[:fiscal_year] = params[:fiscal_year]

    respond_to do |format|
      format.html { redirect_to root_path }
      format.json { render :head, status: :ok }
    end
  end
end
