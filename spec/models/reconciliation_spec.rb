# == Schema Information
#
# Table name: reconciliations
#
#  id                     :bigint(8)        not null, primary key
#  organization_id        :bigint(8)
#  reconcilable_id        :bigint(8)
#  statement_id           :bigint(8)
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#  reconcilable_item_id   :bigint(8)
#  reconcilable_item_type :string
#  reconcilable_type      :string
#
# Indexes
#
#  index_reconciliations_on_organization_id    (organization_id)
#  index_reconciliations_on_reconcilable       (reconcilable_id,reconcilable_type)
#  index_reconciliations_on_reconcilable_item  (reconcilable_item_id,reconcilable_item_type)
#  index_reconciliations_on_statement_id       (statement_id)
#
# Foreign Keys
#
#  fk_rails_...  (organization_id => organizations.id)
#  fk_rails_...  (statement_id => statements.id)
#

require 'rails_helper'

RSpec.describe Reconciliation, type: :model do
  it { should belong_to(:organization) }
  it { should belong_to(:bank_account) }
  it { should belong_to(:statement) }
  it { should belong_to(:entry) }

  it "should have one account element" do
    pending "Implement account element id first" 
    should have_one(:account_element)
   end
end
