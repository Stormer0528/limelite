# == Schema Information
#
# Table name: payments
#
#  id                       :integer          not null, primary key
#  invoice_id               :integer
#  final_pay                :boolean
#  date                     :date
#  tax_amount_in_cents      :integer          default(0)
#  shipping_amount_in_cents :integer          default(0)
#  created_at               :datetime         not null
#  updated_at               :datetime         not null
#  payable_type             :string
#  payable_id               :bigint(8)
#  address_id               :bigint(8)
#  creator_id               :integer
#  bank_account_item_id     :bigint(8)
#  entry_item_id            :bigint(8)
#
# Indexes
#
#  index_payments_on_address_id                   (address_id)
#  index_payments_on_bank_account_item_id         (bank_account_item_id)
#  index_payments_on_creator_id                   (creator_id)
#  index_payments_on_entry_item_id                (entry_item_id)
#  index_payments_on_invoice_id                   (invoice_id)
#  index_payments_on_payable_type_and_payable_id  (payable_type,payable_id)
#
# Foreign Keys
#
#  fk_rails_...  (address_id => addresses.id)
#  fk_rails_...  (creator_id => users.id)
#  fk_rails_...  (invoice_id => invoices.id)
#

require 'rails_helper'

RSpec.describe Payment, type: :model do
  it { is_expected.to have_db_column(:payable_id).of_type(:integer) }
  it { is_expected.to have_db_column(:payable_type).of_type(:string) }

  context "Relationships:" do
    it { should belong_to(:payable) }
    it { should belong_to(:invoice) }
    it { should have_one(:purchase_order).through(:invoice) }
    it { should have_one(:entry).dependent(:destroy) }
  end

  context "Delegations:" do
    it { should delegate_method(:number).to(:purchase_order).with_prefix }
    it { should delegate_method(:status).to(:purchase_order).with_prefix }
    it { should delegate_method(:requisition_number).to(:purchase_order).with_prefix }
    it { should delegate_method(:status).to(:purchase_order).with_prefix }

    it { should delegate_method(:number).to(:invoice).with_prefix }
    it { should delegate_method(:date).to(:invoice).with_prefix }
    it { should delegate_method(:due_date).to(:invoice).with_prefix }
    it { should delegate_method(:amount).to(:invoice).with_prefix }
    it { should delegate_method(:description).to(:invoice).with_prefix }
  end
end
