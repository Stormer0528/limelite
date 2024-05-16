class ApplicationController < ActionController::Base
  include Pundit
  protect_from_forgery with: :exception, prepend: true

  # Devise
  before_action :authenticate_user!

  before_action :set_current_user
  before_action :set_current_org
  before_action :set_user_role
  before_action :set_current_user_group
  before_action :set_site_path
  before_action :set_fiscal_year
  # after_action :verify_authorized

  rescue_from Pundit::NotAuthorizedError, with: :user_not_authorized

  private

  def user_not_authorized
    flash[:alert] = "You are not authorized to perform this action."
    redirect_to(request.referrer || root_path)
  end

  def set_current_org
    # make sure to get subdomain if localhost
    subdomain_str = request.subdomain(/localhost/ =~ request.domain ? 0 : 1)
    subdomain_str.gsub!(".staging", "")
    @current_org = if subdomain_str.present? && !subdomain_str.casecmp("www").zero?
                     Organization.find_by(subdomain: subdomain_str.downcase)
                   end
  rescue ActiveRecord::RecordNotFound
    nil
  end

  def set_current_user_group
    return nil unless @current_user && @current_org

    @current_user_group = @current_user.user_groups.find_by organization_id: @current_org.id
  rescue ActiveRecord::RecordNotFound
    nil
  end

  def set_site_path
    @site_path = request.host_with_port.split(".")
                        .reject {|item| item == @current_org.try(:subdomain) }
                        .join(".")
  end

  def set_current_user
    @current_user = current_user
  end

  def set_fiscal_year(date=cookies.permanent[:fiscal_year]&.to_i || Date.today)
    @fiscal_year = FiscalYear.get_year date
    cookies.permanent[:fiscal_year] = @fiscal_year.year
  end

  def set_accounts_and_elements
    @accounts = if @current_org
                  @current_org.accounts
                              .includes(:account_fund, :account_function, :account_year,
                                        :account_resource, :account_object, :account_location,
                                        :account_goal)
                              .order(slug: :asc)
                else
                  []
                end
    @account_funds = @current_org ? @current_org.account_funds.order(code: :asc) : []
    @account_resources = @current_org ? @current_org.account_resources.order(code: :asc) : []
    @account_goals = @current_org ? @current_org.account_goals.order(code: :asc) : []
    @account_functions = @current_org ? @current_org.account_functions.order(code: :asc) : []
    @account_objects = @current_org ? @current_org.account_objects.order(code: :asc) : []
    @account_years = @current_org ? @current_org.account_years.order(code: :asc) : []
    @account_locations = @current_org ? @current_org.account_locations.order(code: :asc) : []
  end

  def set_user_role
    @user_role = OrganizationAssignment.find_by(user: @current_user, organization: @current_org)
  end

  def pundit_user
    AuthorizationContext.new(current_user, @current_org, @user_role)
  end
end
