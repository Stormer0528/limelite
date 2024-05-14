# == Schema Information
#
# Table name: users
#
#  id                     :integer          not null, primary key
#  first_name             :string           default(""), not null
#  last_name              :string           default(""), not null
#  email                  :string           default(""), not null
#  super_admin            :boolean          default(FALSE), not null
#  encrypted_password     :string           default(""), not null
#  reset_password_token   :string
#  reset_password_sent_at :datetime
#  remember_created_at    :datetime
#  sign_in_count          :integer          default(0), not null
#  current_sign_in_at     :datetime
#  last_sign_in_at        :datetime
#  current_sign_in_ip     :inet
#  last_sign_in_ip        :inet
#  confirmation_token     :string
#  confirmed_at           :datetime
#  confirmation_sent_at   :datetime
#  unconfirmed_email      :string
#  failed_attempts        :integer          default(0), not null
#  unlock_token           :string
#  locked_at              :datetime
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#  back_office            :boolean          default(FALSE)
#  avatar_url             :string
#  slug                   :string
#  archived               :boolean
#  preferences            :jsonb
#
# Indexes
#
#  index_users_on_confirmation_token    (confirmation_token) UNIQUE
#  index_users_on_email                 (email) UNIQUE
#  index_users_on_reset_password_token  (reset_password_token) UNIQUE
#  index_users_on_slug                  (slug)
#  index_users_on_unlock_token          (unlock_token) UNIQUE
#

require "rails_helper"

RSpec.describe User, type: :model do
  context "has valid factories" do
    skip
    it "has a valid user factory" do
      skip
      expect(build_stubbed(:user)).to be_valid
    end

    skip "has a valid admin user factory" do
      expect(build_stubbed(:super_admin_user)).to be_valid
    end
  end

  skip "Need to skip validation before saving" do
    it { should validate_presence_of(:first_name) }
    it { should validate_presence_of(:last_name) }
    it { should validate_presence_of(:email) }
    it { should validate_uniqueness_of(:email) }
  end

  context "responds to attribues" do
    it { should respond_to(:first_name) }
    it { should respond_to(:last_name) }
    it { should respond_to(:email) }
  end

  context "has editor/owner/viewer relationships with many organizations" do
    it { should have_many(:organization_assignments).dependent(:destroy) }
    it { should have_many(:organizations).through(:organization_assignments) }

    it { should have_many(:owner_assignments).class_name(OwnerAssignment) }
    it {
      should have_many(:owned_organizations)
        .through(:owner_assignments)
        .class_name(Organization)
    }

    it {
      should have_many(:editor_assignments)
        .dependent(:destroy)
        .class_name(EditorAssignment)
    }
    it {
      should have_many(:editable_organizations)
        .through(:editor_assignments)
        .class_name(Organization)
    }

    it {
      should have_many(:viewer_assignments)
        .dependent(:destroy).class_name(ViewerAssignment)
    }
    it {
      should have_many(:viewable_organizations)
        .through(:viewer_assignments)
        .class_name(Organization)
    }

    it { should belong_to(:department).required(false) }
    it { should have_one(:account).through(:department) }
  end

  it "should allow saving without a password when the User is persisted" do
    user = User.create first_name: "Test", last_name: "User", email: "test_user@test.com",
                       password: "1412 a very long string with much compexity 9$#", password_confirmation: "test_user@test.com", confirmed_at: DateTime.now
    user.update first_name: "New", last_name: "Name"

    expect(user.errors.full_messages.length).to eq(0)
  end

  it "should validate password for new users" do
    user = User.new first_name: "Test", last_name: "User", email: "test_user@test.com", confirmed_at: DateTime.now

    expect(user.valid?).to be(false)
    expect(user.errors.messages[:password].length).to eq(1)
  end
end
