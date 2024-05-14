class StaticPagesController < ApplicationController
  before_action :set_accounts_and_elements
  before_action :set_organizations, only: [:home]
  before_action :set_archived_organizations, only: [:archived]
  before_action :set_independent_organizations, only: [:independent]

  def home
    render layout: @current_org && policy(@current_org).show? ? "application_minimal" : "application_no_breadcrumb"
  end

  def dashboard
    render layout: "application_minimal"
  end

  def archived
    render layout: @current_org && policy(@current_org).show? ? "application_minimal" : "application_no_breadcrumb"
  end

  def independent
    render layout: @current_org && policy(@current_org).show? ? "application_minimal" : "application_no_breadcrumb"
  end

  private

  def set_archived_organizations
    @organizations = policy_scope(Organization).archived.order("LOWER(name)")
  end

  def set_independent_organizations
    @organizations = policy_scope(Organization).independent.order("LOWER(name)")
  end

  def set_organizations
    @organizations = policy_scope(Organization).unarchived.dependent.order("LOWER(name)")
  end
end
