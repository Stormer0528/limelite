class Export::ProfitAndLossByResourceReportsController < Report::BaseController

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_report
      report_id = params[:report_id]
      funds = @current_user.accessible_funds(@current_org&.id).map {|fund| fund.code }.sort

      @report = Report::ProfitAndLossByResourceReport.where(
        organization: @current_org,
        id: report_id
      ).first
    end
end
