class StatementsController < ApplicationController
  before_action :set_accounts_and_elements
  before_action :set_bank_account, if: -> { params[:bank_account_id] }
  before_action :set_credit_card,  if: -> { params[:credit_card_id] }
  before_action :set_statement, only: [:show, :destroy, :version_show]

  # GET /statements
  # GET /statements.json
  def index
    authorize :reconciliation, :index?
  end

  # GET /statements/1
  # GET /statements/1.json
  def show
    respond_to do |format|
      authorize :reconciliation, :show?
      format.xlsx do
        render xlsx: "show_#{@statement.statementable_type.underscore}"
        response.headers["Content-Disposition"] =
          ['attachment; filename="', file_name, '.xlsx"'].join
      end
    end
  end

  def version_show
    respond_to do |format|
      authorize :reconciliation, :show?

      set_statement_version
      set_statement_audit

      format.xlsx do
        render xlsx: "show_#{@statement.statementable_type.underscore}_version"
        response.headers["Content-Disposition"] =
          ['attachment; filename="', file_name, '.xlsx"'].join
      end
    end
  end

  # DELETE /statements/1
  # DELETE /statements/1.json
  def destroy
    authorize @statement
    @statement.destroy

    respond_to do |format|
      format.html {
        redirect_to "#{bank_account_url(@bank_account)}/reconciliations",
                    notice: "Reconciliation was successfully destroyed."
      }
      format.json { head :no_content }
    end
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_bank_account
    @bank_account = @account = @current_org.bank_accounts.friendly.find(params[:bank_account_id])
  end

  def set_credit_card
    @credit_card = @account = @current_org.credit_cards.friendly.find(params[:credit_card_id])
  end

  def set_statement
    @statement = @account.statements.find(params[:id])
  end

  def set_statement_version
    @statement = @revision = @statement.revision(params[:version_id].to_i)
  end

  def set_statement_audit
    @audit = @revision.audits.find_by version: params[:version_id].to_i
  end

  def file_name
    [
      "Reconciliation",
      ActiveStorage::Filename.new(@statement.statementable.name).sanitized,
      @statement.ended_at.to_formatted_s(:std)
    ].join("-").tr("() ", "-")
  end
end
