# == Schema Information
#
# Table name: account_objects
#
#  id              :integer          not null, primary key
#  name            :string
#  code            :string
#  organization_id :integer
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  normal_balance  :string
#  object_type     :string
#  slug            :string
#
# Indexes
#
#  index_account_objects_on_code                      (code)
#  index_account_objects_on_code_and_organization_id  (code,organization_id) UNIQUE
#  index_account_objects_on_normal_balance            (normal_balance)
#  index_account_objects_on_object_type               (object_type)
#  index_account_objects_on_organization_id           (organization_id)
#
# Foreign Keys
#
#  fk_rails_...  (organization_id => organizations.id)
#

class AccountObject < ApplicationRecord
  include AccountElement
  has_one :bank_account

  # Objects with bank account scopes and methods
  scope :with_bank_account, -> { joins(:bank_account).order(code: :asc) }
  singleton_class.send(:alias_method, :cash_accounts, :with_bank_account)

  def cash_account?
    bank_account ? true : false
  end

  alias_method :with_bank_account?, :cash_account?
  alias_method :general_ledger?, :cash_account?
  alias_method :balance_sheet?, :cash_account?

  DEFAULT_CODE = "0000".freeze
  OBJECT_TYPES = ["BS - Asset", "BS - Liability", "Equity", "Revenue", "Expense"].freeze
  NORMAL_BALANCES = ["Debit", "Credit"].freeze
  # if debit show as opposite on report

  def display_name
    [code,"-",name].join(" ")
  end

  def self.cash_accounts
    with_bank_account
  end

  def current_budget(year=FiscalYear.get_year.year)
     Money.new(accounts.map {|acc| acc.current_budget(year) }
             .inject(Money.new(0.00)){|total, amt| total + amt})
  end

  def balance(start_date = "", end_date = "", account_search = {})
    return Money.new(0.00) if accounts.empty?

    @items = Entry::EntryItemSearch.new(
      scope:   EntryItem.joins(:account).where(accounts: {account_object_id: id}),
      filters: {
        organization_id: organization_id,
        start_date:      start_date,
        end_date:        end_date,
        approved:        true,
        account:         account_search
      }
    ).results.select("entry_items.type, SUM(entry_items.amount_in_cents) AS amount_in_cents").group(:type)

    return Money.new(0.00) if @items.empty?

    credit = if @items.find{|x| x["type"] == "Credit"}
               Money.new @items.find{|x| x["type"] == "Credit"}["amount_in_cents"]
             else
               Money.new 0.00
             end
    debit = if @items.find{|x| x["type"] == "Debit"}
              Money.new @items.find{|x| x["type"] == "Debit"}["amount_in_cents"]
            else
              Money.new 0.00
            end

    bal = credit - debit
    normal_balance == "Debit" ? -bal : bal
  end

  # Only difference is the beginning balance
  def bs_balance(start_date = "", end_date = "", account_search = {})
    return Money.new(0.00) if accounts.empty?

    @items = Entry::EntryItemSearch.new(
      scope:   EntryItem.joins(:account).where(accounts: {account_object_id: id}),
      filters: {
        organization_id:                   organization_id,
        start_date_with_beginning_balance: start_date,
        end_date:                          end_date,
        approved:                          true,
        account:                           account_search
      }
    ).results.select("entry_items.type, SUM(entry_items.amount_in_cents) AS amount_in_cents").group(:type)

    return Money.new(0.00) if @items.empty?

    credit = if @items.find{|x| x["type"] == "Credit"}
               Money.new @items.find{|x| x["type"] == "Credit"}["amount_in_cents"]
             else
               Money.new 0.00
             end
    debit = if @items.find{|x| x["type"] == "Debit"}
              Money.new @items.find{|x| x["type"] == "Debit"}["amount_in_cents"]
            else
              Money.new 0.00
            end

    bal = credit - debit
    normal_balance == "Debit" ? -bal : bal
  end

  def items_within_date_range?(start_date="", end_date="", account_search={})
    item_count = Entry::EntryItemSearch.new(
      scope:   EntryItem.joins(:account).where(accounts: {account_object_id: id}),
      filters: {
        organization_id: organization_id,
        start_date:      start_date,
        end_date:        end_date,
        approved:        true,
        account:         account_search
      }
    ).results.limit(1).count
    item_count > 0
  end

  def self.range_balance(range, organization_id, start_date = "", end_date = "", account_search = {})
    objects = where(code: range, organization_id: organization_id)
    return Money.new(0.00) if objects.empty?

    objects.map do |obj|
      obj.balance(start_date, end_date, account_search)
    end.inject(Money.new(0)) {|total, bal| total + bal }
  end

  def self.bs_range_balance(range, organization_id, start_date = "", end_date = "", account_search = {})
    objects = where(code: range, organization_id: organization_id)
    return Money.new(0.00) if objects.empty?

    objects.map do |obj|
      obj.bs_balance(start_date, end_date, account_search)
    end.inject(Money.new(0)) {|total, bal| total + bal }
  end
end
