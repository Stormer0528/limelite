class Export::AccountElementsController < ApplicationController
  def show
    @accounts = Account::AccountSearch.new(scope: @current_org.accounts, filters: filter_params).results

    respond_to do |format|
      format.xlsx do
        render xlsx: "show"
        response.headers["Content-Disposition"] = ['attachment; filename="', "Accounts.xlsx"].join
      end
    end
  end

  private

  def filter_params
    params.require(:filter).permit(
      :name, :fundCode, :objectCode, :resourceCode,
      :yearCode, :goalCode, :functionCode, :locationCode
    )
  rescue ActionController::ParameterMissing
    {}
  end
end
