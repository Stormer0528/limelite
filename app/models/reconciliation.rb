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

class Reconciliation < ApplicationRecord
  audited associated_with: :statement

  # Scopes
  #-----------------------------------------------------------------------------
  # Bank Account Items
  scope :deposits, -> { joins("INNER JOIN bank_account_items ON bank_account_items.id = reconciliations.reconcilable_item_id").where(reconcilable_item_type: "BankAccount::Item", bank_account_items: {type: "BankAccount::Deposit"}) }
  scope :checks, -> { joins("INNER JOIN bank_account_items ON bank_account_items.id = reconciliations.reconcilable_item_id").where(reconcilable_item_type: "BankAccount::Item", bank_account_items: {type: "BankAccount::Check"}) }

  # Credit Card Items
  scope :charges, -> { joins("INNER JOIN credit_card_items ON credit_card_items.id = reconciliations.reconcilable_item_id").where(reconcilable_item_type: "CreditCard::Item", credit_card_items: {type: "CreditCard::Charge"}) }
  scope :payments, -> { joins("INNER JOIN credit_card_items ON credit_card_items.id = reconciliations.reconcilable_item_id").where(reconcilable_item_type: "CreditCard::Item", credit_card_items: {type: "CreditCard::Payment"}) }

  # Relationships
  #-----------------------------------------------------------------------------
  belongs_to :organization
  belongs_to :reconcilable, polymorphic: true
  belongs_to :statement
  belongs_to :reconcilable_item, polymorphic: true

  # Validations
  #-----------------------------------------------------------------------------
  validates :statement, presence: true
  validates :organization, presence: true
  validates :reconcilable, presence: true
  validates :reconcilable_item, presence: true
end
