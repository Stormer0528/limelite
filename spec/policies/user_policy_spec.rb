require "rails_helper"

RSpec.describe UserPolicy do
  let(:normal_user) { build_stubbed(:user) }
  let(:super_admin_user) { build_stubbed(:super_admin_user) }
  let(:back_office_user) { build_stubbed(:back_office_user) }
  let(:new_user) { User.new }

  subject { described_class }

  context "Super User Permissions" do
    permissions :show?, :create?, :update?, :destroy? do
      it "denies access to normal user" do
        expect(subject).not_to permit(normal_user, new_user)
      end

      it "allows access to super admin user" do
        expect(subject).to permit(super_admin_user, new_user)
      end

      it "allows access to back office user" do
        expect(subject).to permit(back_office_user, new_user)
      end
    end
  end

  context "when interacting with self" do
    let(:current_user) { create(:user) }

    permissions :show?, :update? do
      it "allows access to self" do
        expect(subject).to permit(current_user, current_user)
      end
    end

    permissions :destroy?, :create? do
      it "allows access to self" do
        expect(subject).not_to permit(current_user, current_user)
      end
    end
  end

  permissions ".scope" do
    pending "can view all users if super_admin"
    pending "can view all users if back_office"
    pending "can CRUD all users part of school when admin"
  end
end
