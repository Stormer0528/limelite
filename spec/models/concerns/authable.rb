require "models/concerns/approvable"

RSpec.shared_examples "Authable" do
  it_behaves_like "Approvable"

  context "Authorizations", focus: true do
    before do
      @org = FactoryBot.create(:organization)
      @user = FactoryBot.create(:user)
      @parent_user = FactoryBot.create(:user)
      @parent_group = UserGroup.create name: "Owner Group", organization: @org,
                                       module_permissions: {subject.class.name.to_s => "Owner"}
      @user_group = UserGroup.create name: "Editor Group", parent_id: @parent_group.id, organization: @org,
                                     module_permissions: {subject.class.name.to_s => "Editor"}
      UserGroupAssignment.create user_group: @user_group, organization: @org, user: @user
      UserGroupAssignment.create user_group: @parent_group, organization: @org, user: @parent_user

      @user_role = OrganizationAssignment.new organization: @org, user: @user
      @parent_user_role = OrganizationAssignment.new organization: @org, user: @parent_user

      record.save do |rec|
        rec.creator = @user
        rec.organization = @org
      end
    end

    context "creates an authorization when aasm_state is moved to :needs_approval" do
      before do
        record.send_for_approval user_id: @user.id, reason: "test auth process", admin: false
      end

      it "has has the state needs_approval" do
        expect(record.aasm_state.to_sym).to eql :needs_approval
      end

      it "creates a new auth record" do
        expect(record.authorizations).not_to be_empty
      end

      it "has an empty auth for the correct group" do
        next_auth = record.authorizations.last
        expect(next_auth.user_group_id).to eql(@parent_group.id)
        expect(next_auth.user_id).to be_nil
      end

      it "has the right permissions for auth" do
        # user policy
        auth_ctx = AuthorizationContext.new(@user, @org, @user)
        policy = subject.class.policy_class.new auth_ctx, subject

        # parent policy
        parent_auth_ctx = AuthorizationContext.new(@parent_user, @org, @parent_user)
        parent_policy = subject.class.policy_class.new parent_auth_ctx, subject

        expect(policy.authorize?).to be false
        expect(parent_policy.authorize?).to be true
      end

      xit "it allows anyone in the tree to approve"
    end
  end

  context "it moves to approved when authorizing user group has owner permission" do
    before do
      # binding.pry
    end

    it "has the aasm state :approved" do
      expect(record.aasm_state.to_sym).to be :approved
    end
  end

  xcontext "it only notifies the person in the immediate auth tree"

  xcontext "it skips "
end
