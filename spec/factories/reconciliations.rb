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

FactoryBot.define do
  factory :reconciliation do
    # organization { build_stubbed(:organization) }
    # bank_account { build_stubbed(:bank_account) }
    # statement { build_stubbed(:statement) }
    # entry { build_stubbed(:entry) }
  end
end
