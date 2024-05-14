require "rails_helper"

RSpec.describe SchoolPolicy do
  let(:user) { build_stubbed(:user) }
  let(:super_admin_user) { build_stubbed(:super_admin_user) }
  let(:back_office_user) { build_stubbed(:back_office_user) }
  let(:school) { build_stubbed(:school) }

  subject { described_class }

  permissions ".scope" do
    pending "add some examples to (or delete) #{__FILE__}!"
  end

  context "Super User Permissions" do
    permissions :show?, :create?, :update?, :destroy? do
      it "denies access to normal user" do
        expect(subject).not_to permit(user, school)
      end

      it "allows access to super admin user" do
        expect(subject).to permit(super_admin_user, school)
      end

      it "allows access to back office user" do
        expect(subject).to permit(back_office_user, school)
      end
    end
  end

  # TODO
  # Users Assigned to Schools
  #-----------------------------------------------------------------------------
  context "as an unattached user" do
    permissions :show?, :create?, :update?, :destroy? do
      let(:school) { build_stubbed(:school) }

      it "should not allow anything for unauthenticated user" do
        expect(subject).not_to permit(nil, school)
      end

      it "should not allow anything for authenticated user without relationship to school" do
        let(:user) { build_stubbed(:user) }
        let(:other_school) { build_stubbed(:school) }
        user.owner_assignments.create(school: other_school)
        expect(subject).not_to permit(nil, school)
      end
    end
  end

  context "as an Owner" do
    pending "should not allow allow an owner create"
    pending "should allow allow an owner to read"
    pending "should allow allow an owner to update"
    pending "should allow allow an owner to destroy"
  end

  context "as an Editor" do
    pending "should not allow allow an editor to create"
    pending "should allow allow an editor to read"
    pending "should allow allow an editor to update"
    pending "should not allow allow an editor to destroy"
  end

  context "as an Reader" do
    pending "should not allow allow a owner to create"
    pending "should allow a owner to read"
    pending "should not allow allow a owner to update"
    pending "should not allow allow a owner to destroy"
  end

  # Scopes
  #-----------------------------------------------------------------------------
  permissions do
    pending "scoped schools associated with user"
  end

  permissions do
    pending "only an owner should be able to change permissions for other user"
  end
end
