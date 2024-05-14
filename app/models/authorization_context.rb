class AuthorizationContext
  attr_reader :user, :organization, :organization_assignment
  def initialize(user, organization, organization_assignment=nil)
    @user = user
    @organization = organization
    @organization_assignment = organization_assignment
  end
end
