class Report::BaseController < ApplicationController
  before_action :set_report, only: [:show, :update]

  def show
    respond_to do |format|
      format.html
      format.pdf do
        render  pdf:         @report.class.name.demodulize.underscore,
                layout:      "pdf",
                disposition: "attachment",
                orientation: "Landscape",
                header: { right: "[page] of [topage]", font_name: "Times New Roman", },
                page_size:   "Letter"
      end
      format.xlsx do
        render xlsx: "show"
        response.headers['Content-Disposition'] = ['attachment; filename="', @report.class.name.demodulize.underscore,'.xlsx"'].join
      end
    end
  end

  def destroy
    @report.destroy
    respond_to do |format|
      format.html { redirect_to admin_report_path, notice: 'Report was successfully destroyed.' }
      format.json { head :no_content }
    end
  end
end
