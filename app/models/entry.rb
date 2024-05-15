# == Schema Information
#
# Table name: entries
#
#  id               :integer          not null, primary key
#  organization_id  :integer
#  creator_id       :integer
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  date             :date
#  entry_type       :string           default("Transaction")
#  journalable_type :string
#  journalable_id   :bigint(8)
#  aasm_state       :string
#  backup_file_url  :string
#  file_url         :string
#
# Indexes
#
#  index_entries_on_aasm_state                           (aasm_state)
#  index_entries_on_creator_id                           (creator_id)
#  index_entries_on_date                                 (date)
#  index_entries_on_entry_type                           (entry_type)
#  index_entries_on_journalable_type_and_journalable_id  (journalable_type,journalable_id)
#  index_entries_on_organization_id                      (organization_id)
#
# Foreign Keys
#
#  fk_rails_...  (creator_id => users.id)
#  fk_rails_...  (organization_id => organizations.id)
#

class Entry < ApplicationRecord
  include AASM
  include Loggable
  include Authable

  # RELATIONSHIPS
  #-----------------------------------------------------------------------------
  belongs_to :creator, class_name: "User"
  belongs_to :organization
  belongs_to :journalable, polymorphic: true, optional: true

  has_many :entry_items, dependent: :destroy
  accepts_nested_attributes_for :entry_items, allow_destroy: true

  has_many :credits, dependent: :destroy
  accepts_nested_attributes_for :credits, allow_destroy: true

  has_many :debits, dependent: :destroy
  accepts_nested_attributes_for :debits, allow_destroy: true

  has_many :accounts,  -> { distinct }, through: :entry_items
  has_many :vendors,   -> { distinct }, through: :entry_items, source: "payable", source_type: "Vendor"
  has_many :customers, -> { distinct }, through: :entry_items, source: "payable", source_type: "Customer"

  has_many :bank_account_items, class_name: "BankAccount::Item", dependent: :destroy
  has_many :credit_card_items,  class_name: "CreditCard::Item", dependent: :destroy
  has_many :payments, through: :entry_items

  # CALLBACKS
  #-----------------------------------------------------------------------------
  after_commit :create_and_update_bank_account_items,
               :update_journalable_date,
               :detatch_orphaned_bank_account_items
  # TODO: Add create_and_update_credit_card_items

  def create_and_update_bank_account_items
    return if entry_type == "Beginning Balance"

    hash = grouped_entry_items_by_bank_account_id
    return if hash.empty?

    hash.each do |key, value|
      item = bank_account_items.find_or_initialize_by(bank_account_id: key)
      next if ["approved", "printed"].include?(item.aasm_state)

      calc = value.inject(Money.new(0)) {|total, ei| total + ei.amount }

      item.date = date

      unless item.persisted?
        item.creator_id = creator_id
        item.number = "JE#{id}"
        item.amount = calc
      end

      if hash.length == 2
        item.type = "BankAccount::AccountTransfer" unless item.persisted?
      else
        item.type = calc >= 0 ? "BankAccount::Check" : "BankAccount::Deposit"
      end

      item.save
    end
  end

  def detatch_orphaned_bank_account_items
    bank_account_items.map do |item|
      item.update(entry_id: nil) if item.entry_items.empty?
    end
  end

  def update_journalable_date
    journalable.update(date: date) if journalable && journalable.date != date
  end

  # Scopes
  #-----------------------------------------------------------------------------
  scope :by_vendor, ->(vendor_id) {
    joins(:entry_items).where("entry_items.payable_type = ?, entry_items.payable_id = ?", "Vendor", vendor_id)
  }
  scope :by_customer, ->(customer_id) {
    joins(:entry_items).where("entry_items.payable_type = ?, entry_items.payable_id = ?", "Customer", customer_id)
  }
  scope :dated_before,  ->(before_date) { where("date <= ?", before_date) }
  scope :dated_after,   ->(after_date)  { where("date >= ?", after_date) }
  scope :dated_between, ->(before_date, after_date) { where(date: before_date..after_date) }

  scope :by_min_amount, ->(min_amount) {
    joins(:entry_items).group(:id, :entry_id).having("ABS(SUM(amount_in_cents)) >= ?", min_amount)
  }
  scope :by_max_amount, ->(max_amount) {
    joins(:entry_items).group(:id, :entry_id).having("ABS(SUM(amount_in_cents)) <= ?", max_amount)
  }

  scope :by_code, ->(type, code) {
                    if Entry.is_empty?(type) || Entry.is_empty?(code)
                      all
                    else
                      joins(entry_items: {account: :"account_#{type.to_s.singularize}"}).where("account_#{type.to_s.pluralize}": {code: code}).distinct
                    end
                  }

  scope :by_credit_code, ->(type, code) {
                           if Entry.is_empty?(type) || Entry.is_empty?(code)
                             all
                           else
                             joins(entry_items: {account: :"account_#{type.to_s.singularize}"}).where("account_#{type.to_s.pluralize}": {code: code}, entry_items: {type: "Credit"}).distinct
                           end
                         }

  scope :by_debit_code, ->(type, code) {
                          if Entry.is_empty?(type) || Entry.is_empty?(code)
                            all
                          else
                            joins(entry_items: {account: :"account_#{type.to_s.singularize}"}).where("account_#{type.to_s.pluralize}": {code: code}, entry_items: {type: "Debit"}).distinct
                          end
                        }

  scope :by_partial_code, ->(type, code) {
                            if Entry.is_empty?(type) || Entry.is_empty?(code)
                              all
                            else
                              joins(entry_items: {account: :"account_#{type.to_s.singularize}"}).where("account_#{type.to_s.pluralize}.code ILIKE CONCAT('%',?,'%')", code).distinct
                            end
                          }

  # CONSTANTS
  #-----------------------------------------------------------------------------
  TYPES = ["Transaction", "Journal Entry", "Payroll", "Accounts Payable",
           "Accounts Receivable", "Beginning Balance", "Payment", "Revenue"].freeze

  # Validations
  #-----------------------------------------------------------------------------
  validates_associated :entry_items
  validates_each :balance do |record, attr, _value|
    record.errors.add(attr, "must be balanced") unless record.balanced?
  end

  # checks empty but allows objects of other classes
  def self.is_empty?(val)
    val.instance_of?(String) ? val.empty? : val.nil?
  end

  # Pundit Policy
  #---------------------------------------------------------------------------
  def self.policy_class
    EntryPolicy
  end

  # Instance Methods
  #-----------------------------------------------------------------------------
  def identifier
    [date.to_formatted_s(:std), entry_type, "-", memo].join(" ")
  end

  def amount
    total_credits
  end

  def total_credits
    items = entry_items.select {|item|
      !item.marked_for_destruction? && item.type == "Credit"
    }

    Money.new items.inject(0) {|total, credit| credit.amount + total }
  end

  def total_debits
    items = entry_items.select {|item|
      !item.marked_for_destruction? && item.type == "Debit"
    }

    Money.new items.inject(0) {|total, debit| debit.amount + total }
  end

  def amount_in_cents
    Money.new(amount).fractional
  end

  def balance
    total_credits + total_debits
  end

  def balances
    grouped_entry_items.map do |_k, v|
      Money.new(v.inject(0) {|total, item| item.amount + total })
    end
  end

  def balanced?
    balances.all?(&:zero?)
  end

  def grouped_entry_items
    entry_items.reject(&:marked_for_destruction?).group_by {|item|
      [item.account_fund_id, item.account_resource_id]
    }
  end

  def grouped_entry_items_by_bank_account_id
    entry_items.with_bank_account.group_by {|item| item.account.bank_account.id }
  end

  # State Machine
  #-----------------------------------------------------------------------------
  aasm whiny_transitions: false do
    state :draft, initial: true
    state :needs_approval, :approved, :needs_revision

    after_all_transitions :log_status_change

    event :send_for_approval, after: proc {|*args| send_associated_for_approvals(*args) } do
      transitions from: [:draft, :needs_revision],
                  to: :approved,
                  guard: proc {|args| args&.dig(:admin) }
      transitions from: [:draft, :needs_revision],
                  to: :needs_approval,
                  after: proc {|args| start_authorization(args) }
    end

    event :approve, after: proc {|*args| approve_associated(*args) } do
      transitions from: :needs_approval,
                  to: :approved,
                  after: :handle_auth,
                  guard: proc {|args| auth_finished?(args) }
    end

    event :deny, after: proc {|*args| deny_associated(*args) } do
      transitions from: :needs_approval, to: :needs_revision, after: proc {|args| handle_deny(args) }
    end

    event :reverse_approval, after: proc {|*args| reverse_associated_approvals(*args) } do
      transitions from: :approved, to: :needs_revision
    end
  end

  # Overriding authable module
  def auth_finished?(args)
    return true unless current_auth

    group = UserGroup.find(args[:user_group_id])
    permission = group.module_permissions.dig(record_class)

    return false unless args[:admin] || ["Owner", "Editor"].include?(permission)

    auth = current_auth || authorizations.new
    auth_approve  user_id: args[:user_id],
                  user_group_id: args[:user_group_id],
                  reason: args[:reason]

    true
  end

  private

  def send_associated_for_approvals(*args)
    save
    bank_account_items.each do |item|
      item.send_for_approval(*args) if item.becomes(item.type.constantize)&.may_send_for_approval?(*args)
    end

    credit_card_items.each do |item|
      item.send_for_approval(*args) if item.becomes(item.type.constantize)&.may_send_for_approval?(*args)
    end

    journalable.send_for_approval(*args) if journalable&.may_send_for_approval?(*args)
  end

  def approve_associated(*args)
    save
    bank_account_items.each do |item|
      item.approve(*args) if item&.may_approve?(*args)
    end

    credit_card_items.each do |item|
      item.approve(*args) if item&.may_approve?(*args)
    end

    journalable.approve(*args) if journalable&.may_approve?(*args)
  end

  def deny_associated(*args)
    save
    bank_account_items.each do |item|
      item.deny(*args) if item&.may_deny?(*args)
    end

    credit_card_items.each do |item|
      item.deny(*args) if item&.may_deny?(*args)
    end

    journalable.deny(*args) if journalable&.may_deny?(*args)
  end

  def reverse_associated_approvals(*args)
    save
    bank_account_items.each do |item|
      item.reverse_approval(*args) if item&.may_reverse_approval?(*args)
    end

    credit_card_items.each do |item|
      item.reverse_approval(*args) if item&.may_reverse_approval?(*args)
    end

    journalable.reverse_approval(*args) if journalable&.may_reverse_approval?(*args)
  end
end
