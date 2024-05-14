# == Schema Information
#
# Table name: statements
#
#  id                         :bigint(8)        not null, primary key
#  organization_id            :bigint(8)
#  started_at                 :date
#  ended_at                   :date
#  created_at                 :datetime         not null
#  updated_at                 :datetime         not null
#  starting_balance_in_cents  :integer          default(0), not null
#  starting_balance_currency  :string           default("USD"), not null
#  ending_balance_in_cents    :integer          default(0), not null
#  ending_balance_currency    :string           default("USD"), not null
#  adjustment_amount_in_cents :integer          default(0), not null
#  adjustment_amount_currency :string           default("USD"), not null
#  adjustment_date            :date
#  creator_id                 :integer
#  file_url                   :string
#  statementable_type         :string
#  statementable_id           :bigint(8)
#  aasm_state                 :string
#
# Indexes
#
#  index_statements_on_aasm_state                               (aasm_state)
#  index_statements_on_creator_id                               (creator_id)
#  index_statements_on_organization_id                          (organization_id)
#  index_statements_on_statementable_type_and_statementable_id  (statementable_type,statementable_id)
#
# Foreign Keys
#
#  fk_rails_...  (creator_id => users.id)
#  fk_rails_...  (organization_id => organizations.id)
#

class Statement < ApplicationRecord
  audited

  include AASM
  include FileUploadable
  include Loggable

  # Scopes
  #-----------------------------------------------------------------------------
  scope :dated_before,  ->(before_date) { where("ended_at <= ?", before_date) }
  scope :dated_after,   ->(after_date)  { where("ended_at >= ?", after_date) }
  scope :dated_between, ->(before_date, after_date) { where(ended_at: before_date..after_date) }

  # Relationships
  #--------------------------------------------------------------
  belongs_to :organization
  belongs_to :statementable, polymorphic: true
  belongs_to :creator, class_name: "User"

  has_many  :reconciliations, dependent: :destroy
  has_many  :bank_account_items, through: :reconciliations,
                                 source: :reconcilable_item,
                                 source_type: "BankAccount::Item"
  has_many  :credit_card_items, through: :reconciliations,
                                source: :reconcilable_item,
                                source_type: "CreditCard::Item"

  # Money
  #-----------------------------------------------------------------------------
  monetize :starting_balance_in_cents
  monetize :ending_balance_in_cents
  monetize :adjustment_amount_in_cents

  # Validations
  #-----------------------------------------------------------------------------
  validates_presence_of(:started_at)
  validates_presence_of(:ended_at)
  validates_with ApprovalValidator
  # This is not the case. Need to disable.
  # validate :reconciled_items_must_be_within_date_range

  # TODO: requires start_date-end_rdate to include all items

  # Instance Methods
  #-----------------------------------------------------------------------------

  def total(type: ["BankAccount::Deposit", "BankAccount::Check", "BankAccount::AccountTransfer"])
    Money.new bank_account_items.where(type: type).select(:amount_in_cents).sum(:amount_in_cents)
  end

  def reconciled_items_must_be_within_date_range
    errors.add(:ended_at, "date range does not include all items in the statement") unless reconciliations
                                                                                           .map(&:reconcilable_item)
                                                                                           .all? {|r| (started_at..ended_at).cover?(r&.date) }
  end

  def unreconciled_items
    method_name = statementable_type == "BankAccount" ? "account_items" : "items"
    statementable.send(method_name)
                 .unreconciled
                 .dated_between(started_at, ended_at)
  end

  # State Machine without Authorization
  #-----------------------------------------------------------------------------
  aasm whiny_transitions: false do
    state :draft, initial: true
    state :needs_approval, :approved, :needs_revision

    after_all_transitions :log_status_change

    event :send_for_approval, after: :save do
      transitions from: [:draft, :needs_revision, :needs_approval],
                  to: :approved,
                  guard: proc {|args| args&.dig(:admin) }
      transitions from: [:draft, :needs_revision], to: :needs_approval
    end

    event :approve, after: :save do
      transitions from: [:draft, :needs_revision, :needs_approval],
                  to: :approved,
                  guard: proc {|args| args&.dig(:admin) }
      transitions from: :needs_approval, to: :approved
    end

    event :deny, after: :save do
      transitions from: :needs_approval, to: :needs_revision
    end

    event :reverse_approval, after: :save do
      transitions from: :approved, to: :needs_revision
    end
  end
end
