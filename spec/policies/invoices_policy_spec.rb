require 'rails_helper'

RSpec.describe InvoicesPolicy do

  let(:user) { User.new }
  let(:admin_user) { User.new super_admin: true }
  let(:ap_clerk) { User.new super_admin: true }
  let(:staff_accountant) { User.new super_admin: true }

  subject { described_class }

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

  permissions :send_for_approval? do
    pending
  end

  permissions :approve? do
    pending
  end

  permissions :deny? do
    pending
  end

  permissions :send_for_payment_approval? do
    pending
  end

  permissions :approve_payment? do
    pending
  end

  permissions :deny_payment? do
    pending
  end

  permissions :approve_signatures? do
    pending
  end
end
