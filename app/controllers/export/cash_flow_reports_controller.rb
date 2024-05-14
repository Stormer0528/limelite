class Export::CashFlowReportsController < Report::BaseController
  # Set Custom report things

  private

  def set_report
    report_id = params[:report_id]
    funds = @current_user.accessible_funds(@current_org&.id).map {|fund| fund.code }.sort

    @report = Report::CashFlowReport.where(
      organization: @current_org,
      id: report_id
    ).first
  end
end
