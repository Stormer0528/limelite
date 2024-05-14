class ApprovalLogsController < ApplicationController
  def index
    authorize :admin

    render layout: "application_minimal"
  end
end
