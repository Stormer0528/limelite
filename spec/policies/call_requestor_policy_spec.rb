require "rails_helper"
require "pundit/rspec"

# def set_user_role
#   @user_role = OrganizationAssignment.find_by(
#     user: @current_user, organization: @current_org
#   )
# end

# def pundit_user
#   AuthorizationContext.new(
#     current_user,
#     @current_org,
#     @user_role
#   )
# end

RSpec.describe CallRequestorPolicy, type: :policy, user_permissions: true do
  # before do
  #   # Create Org

  # end

  let(:org) { create(:organization) }
  # Create User
  let(:user) { create(:user) }
  # Give Organization Assignment
  let(:organization_assignment) {
    OrganizationAssignment.create(
      user: user,
      organization: org,
      type: "EditorAssignment",
      role: "Call Requestor"
    )
  }

  subject { described_class }

  context "Being a Call Requestor for an Account" do
    it "is bound with pry" do
      # binding.pry
    end

    skip "Should only be able to access own account"
    skip "Should not be able to access other accounts"
    skip "Should not be able to access Reports"
  end

  context "Being a Call Requestor for an Account" do
  end

  permissions ".scope" do
    pending "add some examples to (or delete) #{__FILE__}"
  end

  permissions :show? do
    pending "add some examples to (or delete) #{__FILE__}"
  end

  permissions :create? do
    pending "add some examples to (or delete) #{__FILE__}"
  end

  permissions :update? do
    pending "add some examples to (or delete) #{__FILE__}"
  end

  permissions :destroy? do
    pending "add some examples to (or delete) #{__FILE__}"
  end
end
