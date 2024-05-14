# == Schema Information
#
# Table name: invoices
#
#  id                :integer          not null, primary key
#  number            :string
#  date              :date
#  description       :text
#  due_date          :date
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  slug              :string
#  invoiceable_type  :string
#  invoiceable_id    :bigint(8)
#  file_url          :string
#  aasm_state        :string
#  organization_id   :bigint(8)
#  paid              :boolean          default(FALSE)
#  final_payment_url :string
#  creator_id        :bigint(8)
#
# Indexes
#
#  index_invoices_on_aasm_state                           (aasm_state)
#  index_invoices_on_creator_id                           (creator_id)
#  index_invoices_on_date                                 (date)
#  index_invoices_on_due_date                             (due_date)
#  index_invoices_on_invoiceable_type_and_invoiceable_id  (invoiceable_type,invoiceable_id)
#  index_invoices_on_number                               (number)
#  index_invoices_on_number_and_invoiceable               (number,invoiceable_type,invoiceable_id) UNIQUE WHERE ((aasm_state)::text <> 'voided'::text)
#  index_invoices_on_organization_id                      (organization_id)
#  index_invoices_on_slug                                 (slug)
#  index_invoices_on_slug_invoiceable                     (slug,invoiceable_type,invoiceable_id) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (creator_id => users.id)
#  fk_rails_...  (organization_id => organizations.id)
#

require "rails_helper"
require "models/concerns/authable"

RSpec.describe Invoice, type: :model do
  context "Relationships:" do
    it { should belong_to(:organization) }
    it { should belong_to(:invoiceable) }
    it { should have_one(:purchase_order) }
    it { should have_many(:payments).dependent(:destroy) }
    it { should have_many(:checks).through(:payments) }
    it { should have_one(:entry).dependent(:destroy) }

    # Delegations
    it { should delegate_method(:name).to(:invoiceable).with_prefix.allow_nil }
    it { should delegate_method(:ein).to(:invoiceable).with_prefix.allow_nil }

    skip { should delegate_method(:entry_items).to(:entry).allow_nil }
    skip { should delegate_method(:entry_type).to(:entry).allow_nil }

    # Nested Attributes
    it { should accept_nested_attributes_for(:entry).allow_destroy(true) }
    it { should accept_nested_attributes_for(:payments).allow_destroy(true) }
  end

  xcontext "Authable" do
    context "Included Relationships" do
      it { should have_many(:authorizations) }
      it { should have_many(:user_groups) }
    end

    context "Authable", type: :concern do
      before do
      end

      skip "#authorize"
      skip "#auth_approve"
      skip "#auth_deny"

      skip "#next_auth_group"
      skip "#last_auth"
      skip "#last_auth_group"
    end
  end

  context do
    let(:record) { build(:entry) }
    it_behaves_like "Authable"
  end

  xit "allows a user to void where appropriate permissions present"
end
