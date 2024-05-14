RSpec.shared_examples "Approvable" do
  context "Permissions" do
    before do
      @org = FactoryBot.create(:organization)
      @user = FactoryBot.create(:user)
    end

    context "User Group has Admin Permissions" do
      before do
        @admin_user = FactoryBot.create(:user, super_admin: true)

        # create Auth context
        @auth_ctx = AuthorizationContext.new(@admin_user, @org, @user)
        @policy = subject.class.policy_class.new @auth_ctx, subject
      end

      it "allows a user to view the index when the user's group has the owner permission" do
        expect(@policy.index?).to be true
      end

      it "allows a user to view a record when the user's group has the owner permission" do
        expect(@policy.view?).to be true
        expect(@policy.show?).to be true
      end

      it "allows a user to create a record when the user's group has the owner permission" do
        expect(@policy.create?).to be true
      end

      it "allows a user to update a record when the user's group has the owner permission" do
        expect(@policy.update?).to be true
        expect(@policy.edit?).to be true
      end

      it "allows a user to delete a record when the user's group has the owner permission" do
        expect(@policy.destroy?).to be true
        expect(@policy.delete?).to be true
      end

      context "AASM State Changes" do
        context "#save_draft" do
          it "does not allow a user to delete a record when the user's group has the viewer permission" do
            expect(@policy.save_draft?).to be true
          end
        end
        context "#send_for_approval" do
          it "does not allow a user to delete a record when the user's group has the viewer permission" do
            expect(@policy.send_for_approval?).to be true
          end
        end
        context "#approve" do
          it "does not allow a user to delete a record when the user's group has the viewer permission" do
            expect(@policy.approve?).to be true
          end
        end
        context "#deny" do
          it "does not allow a user to delete a record when the user's group has the viewer permission" do
            expect(@policy.deny?).to be true
          end
        end
        context "#reverse_approval" do
          it "does not allow a user to delete a record when the user's group has the viewer permission" do
            expect(@policy.reverse_approval?).to be true
          end
        end
      end
    end

    context "User Group has Owner Permissions" do
      before do
        @user_group = UserGroup.create name: "Owner Group", organization: @org,
                                       module_permissions: {subject.class.name.to_s => "Owner"}
        UserGroupAssignment.create user_group: @user_group, organization: @org, user: @user
        @user_role = OrganizationAssignment.new organization: @org, user: @user

        # create Auth context
        @auth_ctx = AuthorizationContext.new(@user, @org, @user)
        @policy = subject.class.policy_class.new @auth_ctx, subject
      end

      it "allows a user to view the index when the user's group has the owner permission" do
        expect(@policy.index?).to be true
      end

      it "allows a user to view a record when the user's group has the owner permission" do
        expect(@policy.view?).to be true
        expect(@policy.show?).to be true
      end

      it "allows a user to create a record when the user's group has the owner permission" do
        expect(@policy.create?).to be true
      end

      it "allows a user to update a record when the user's group has the owner permission" do
        expect(@policy.update?).to be true
        expect(@policy.edit?).to be true
      end

      it "allows a user to delete a record when the user's group has the owner permission" do
        expect(@policy.destroy?).to be true
        expect(@policy.delete?).to be true
      end

      context "AASM State Changes" do
        context "#save_draft" do
          it "does not allow a user to delete a record when the user's group has the viewer permission" do
            expect(@policy.save_draft?).to be true
          end
        end
        context "#send_for_approval" do
          it "does not allow a user to delete a record when the user's group has the viewer permission" do
            expect(@policy.send_for_approval?).to be true
          end
        end
        context "#approve" do
          it "does not allow a user to delete a record when the user's group has the viewer permission" do
            expect(@policy.approve?).to be true
          end
        end
        context "#deny" do
          it "does not allow a user to delete a record when the user's group has the viewer permission" do
            expect(@policy.deny?).to be true
          end
        end
        context "#reverse_approval" do
          it "does not allow a user to delete a record when the user's group has the viewer permission" do
            expect(@policy.reverse_approval?).to be true
          end
        end
      end
    end

    context "User Group has Editor Permissions" do
      before do
        @user_group = UserGroup.create name: "Owner Group", organization: @org,
                                       module_permissions: {subject.class.name.to_s => "Editor"}
        UserGroupAssignment.create user_group: @user_group, organization: @org, user: @user
        @user_role = OrganizationAssignment.new organization: @org, user: @user

        # create Auth context
        @auth_ctx = AuthorizationContext.new(@user, @org, @user)
        @policy = subject.class.policy_class.new @auth_ctx, subject
      end

      it "allows a user to view the index when the user's group has the editor permission" do
        expect(@policy.index?).to be true
      end

      it "allows a user to view a record when the user's group has the editor permission" do
        expect(@policy.view?).to be true
        expect(@policy.show?).to be true
      end

      it "allows a user to create a record when the user's group has the editor permission" do
        expect(@policy.create?).to be true
      end

      it "allows a user to update a record when the user's group has the editor permission" do
        expect(@policy.update?).to be true
        expect(@policy.edit?).to be true
      end

      it "does not allow a user to delete a record when the user's group has the editor permission" do
        expect(@policy.destroy?).to be false
        expect(@policy.delete?).to be false
      end

      context "AASM State Changes" do
        context "#save_draft" do
          it "does not allow a user to delete a record when the user's group has the viewer permission" do
            expect(@policy.save_draft?).to be true
          end
        end

        context "#send_for_approval" do
          it "does not allow a user to delete a record when the user's group has the viewer permission" do
            expect(@policy.send_for_approval?).to be true
          end
        end

        context "#approve" do
          it "does not allow a user to delete a record when the user's group has the viewer permission" do
            expect(@policy.approve?).to be false
          end
        end
        context "#deny" do
          it "does not allow a user to delete a record when the user's group has the viewer permission" do
            expect(@policy.deny?).to be false
          end
        end

        context "#reverse_approval" do
          it "does not allow a user to delete a record when the user's group has the viewer permission" do
            expect(@policy.reverse_approval?).to be false
          end
        end
      end
    end

    context "User Group has Viewer Permissions" do
      before do
        @user_group = UserGroup.create name: "Owner Group", organization: @org,
                                       module_permissions: {subject.class.name.to_s => "Viewer"}
        UserGroupAssignment.create user_group: @user_group, organization: @org, user: @user
        @user_role = OrganizationAssignment.new organization: @org, user: @user

        # create Auth context
        @auth_ctx = AuthorizationContext.new(@user, @org, @user)
        @policy = subject.class.policy_class.new @auth_ctx, subject
      end

      it "allows a user to view the index when the user's group has the viewer permission" do
        expect(@policy.index?).to be true
      end

      it "allows a user to view a record when the user's group has the viewer permission" do
        expect(@policy.view?).to be true
        expect(@policy.show?).to be true
      end

      it "does not allow a user to create a record when the user's group has the viewer permission" do
        expect(@policy.create?).to be false
      end

      it "does not allow a user to update a record when the user's group has the viewer permission" do
        expect(@policy.update?).to be false
        expect(@policy.edit?).to be false
      end

      it "does not allow a user to delete a record when the user's group has the viewer permission" do
        expect(@policy.destroy?).to be false
        expect(@policy.delete?).to be false
      end

      context "AASM State Changes" do
        context "#save_draft" do
          it "does not allow a user to delete a record when the user's group has the viewer permission" do
            expect(@policy.save_draft?).to be false
          end
        end
        context "#send_for_approval" do
          it "does not allow a user to delete a record when the user's group has the viewer permission" do
            expect(@policy.send_for_approval?).to be false
          end
        end
        context "#approve" do
          it "does not allow a user to delete a record when the user's group has the viewer permission" do
            expect(@policy.approve?).to be false
          end
        end
        context "#deny" do
          it "does not allow a user to delete a record when the user's group has the viewer permission" do
            expect(@policy.deny?).to be false
          end
        end
        context "#reverse_approval" do
          it "does not allow a user to delete a record when the user's group has the viewer permission" do
            expect(@policy.reverse_approval?).to be false
          end
        end
      end
    end

    context "No Group Permissions" do
      before do
        @user_group = UserGroup.create name: "Owner Group", organization: @org,
                                       module_permissions: {}
        UserGroupAssignment.create user_group: @user_group, organization: @org, user: @user
        @user_role = OrganizationAssignment.new organization: @org, user: @user

        # create Auth context
        @auth_ctx = AuthorizationContext.new(@user, @org, @user)
        @policy = subject.class.policy_class.new @auth_ctx, subject
      end

      it "allows a user to view the index when the user's group has no permissions set" do
        expect(@policy.index?).to be false
      end

      it "allows a user to view a record when the user's group has no permissions set" do
        expect(@policy.view?).to be false
        expect(@policy.show?).to be false
      end

      it "does not allow a user to create a record when the user's group has no permissions set" do
        expect(@policy.create?).to be false
      end

      it "does not allow a user to update a record when the user's group has no permissions set" do
        expect(@policy.update?).to be false
        expect(@policy.edit?).to be false
      end

      it "does not allow a user to delete a record when the user's group has no permissions set" do
        expect(@policy.destroy?).to be false
        expect(@policy.delete?).to be false
      end
    end
  end
end
