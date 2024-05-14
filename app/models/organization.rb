# == Schema Information
#
# Table name: organizations
#
#  id          :integer          not null, primary key
#  name        :string
#  description :string
#  email       :string
#  phone       :string
#  subdomain   :string
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  slug        :string
#  alias       :string
#
# Indexes
#
#  index_organizations_on_alias      (alias)
#  index_organizations_on_name       (name) UNIQUE
#  index_organizations_on_slug       (slug)
#  index_organizations_on_subdomain  (subdomain) UNIQUE
#

class Organization < ApplicationRecord
  extend FriendlyId
  friendly_id :slug_candidates, use: [:slugged]

  # SCOPES
  #-----------------------------------------------------------------------------
  default_scope { order('LOWER(name)') }

  scope :unarchived, -> { where(archived: [false, nil]) }
  scope :archived, -> { where(archived: true) }

  scope :dependent, -> { where(independent: [false, nil]) }
  scope :independent, -> { where(independent: true) }

  # RELATIONSHIPS
  #-----------------------------------------------------------------------------
  has_many :invoices, dependent: :destroy
  has_many :payments, through: :invoices
  has_many :file_uploads

  # Vendors
  has_many :vendors, dependent: :destroy
  has_many :vendor_invoices, -> { where(invoiceable_type: "Vendor") }, class_name: "Invoice"
  has_many :vendor_payments, -> {
                               where(payable_type: "Vendor")
                             }, class_name: "Payment", through: :invoices, source: :payments

  has_many :purchase_orders, dependent: :destroy

  # Batch Upload
  has_many :batch_uploads

  # Customers
  has_many :customers, dependent: :destroy
  has_many :customer_invoices, -> { where(invoiceable_type: "Customer") }, class_name: "Invoice"
  has_many :customer_payments, -> {
                                 where(payable_type: "Customer")
                               }, class_name: "Payment", through: :invoices, source: :payments

  # Accounts
  has_many :accounts, dependent: :destroy
  has_many :account_functions, dependent: :destroy
  has_many :account_funds, dependent: :destroy
  has_many :account_goals, dependent: :destroy
  has_many :account_locations, dependent: :destroy
  has_many :account_objects, dependent: :destroy
  has_many :account_resources, dependent: :destroy
  has_many :account_years, dependent: :destroy

  has_many :entries
  has_many :entry_items, through: :entries

  # Addresses
  has_many :addresses, as: :addressable, dependent: :destroy
  accepts_nested_attributes_for :addresses, allow_destroy: true

  # Users
  has_many :organization_assignments, dependent: :destroy
  has_many :users, through: :organization_assignments
  has_many :user_groups, dependent: :destroy
  has_many :user_group_assignments, dependent: :destroy

  # TODO: Delete
  #-------------------------------------------------------------------------------
  has_many :viewer_assignments, dependent: :destroy
  has_many :viewers, through: :viewer_assignments, source: :user

  has_many :editor_assignments, dependent: :destroy
  has_many :editors, through: :editor_assignments, source: :user

  has_many :owner_assignments, dependent: :destroy
  has_many :owners, through: :owner_assignments, source: :user
  #-------------------------------------------------------------------------------

  # Bank Accounts
  has_many :bank_accounts
  has_many :bank_account_items, through: :bank_accounts, source: :account_items
  has_many :checks,             through: :bank_accounts
  has_many :deposits,           through: :bank_accounts
  has_many :account_transfers,  through: :bank_accounts

  has_many :printer_settings, dependent: :destroy
  has_many :statements

  # Credit Cards
  has_many :credit_cards
  has_many :credit_card_charges,       through: :credit_cards, source: :charges
  has_many :credit_card_payments,      through: :credit_cards, source: :payments
  has_many :credit_card_items, through: :credit_cards, source: :items

  # Reports
  has_one :ap_aging_report, dependent: :destroy, class_name: "Report::ApAgingReport"
  has_one :ar_aging_report, dependent: :destroy, class_name: "Report::ArAgingReport"
  has_one :balance_sheet, dependent: :destroy, class_name: "Report::BalanceSheet"
  has_one :balance_sheet_by_month, dependent: :destroy, class_name: "Report::BalanceSheetByMonth"
  has_one :balance_sheet_by_resource, dependent: :destroy, class_name: "Report::BalanceSheetByResource"
  has_one :budget_vs_actual_report, dependent: :destroy, class_name: "Report::BudgetVsActualReport"
  has_one :cash_flow_report, dependent: :destroy, class_name: "Report::CashFlowReport"
  has_one :monthly_cash_flow_report, dependent: :destroy, class_name: "Report::MonthlyCashFlowReport"
  has_one :monthly_profit_and_loss_statement, dependent: :destroy, class_name: "Report::MonthlyProfitLossStatement"
  has_one :profit_and_loss_by_resource_report, dependent: :destroy, class_name: "Report::ProfitAndLossByResourceReport"
  has_one :profit_and_loss_statement, dependent: :destroy, class_name: "Report::ProfitAndLossStatement"
  has_one :vendor_1099_report, dependent: :destroy, class_name: "Report::Vendor1099Report"
  has_one :vendor_report, dependent: :destroy, class_name: "Report::VendorReport"

  # VALIDATIONS
  #-----------------------------------------------------------------------------
  validates :name, presence: true, uniqueness: true
  validates :subdomain, presence: true, uniqueness: true, format: { with: /\A[^A-Z]+\z/, message: 'only allow lowercase letters' }

  MODEL_TYPES = ["fund", "resource", "goal", "function",
                 "location", "object", "year"].freeze

  def dup_codes(org_id=2)
    MODEL_TYPES.each do |model_type|
      puts "Creating #{model_type.capitalize}:"

      "Account#{model_type.classify}".constantize.where(organization_id: org_id).each do |ac|
        code = public_send("account_#{model_type}s").find_or_initialize_by(code: ac.code)
        code.update(name: ac.name)
      end
    end
  end

  def slug_candidates
    [:name, :subdomain]
  end

  def earliest_fiscal_year
    earliest_date = entries.select(:date).order(date: :asc).first&.date || Date.today
    FiscalYear.get_year earliest_date
  end

  def current_fiscal_year
    FiscalYear.current_fiscal_year
  end

  def next_fiscal_year
    FiscalYear.get_year(Date.today + 1.year)
  end

  def root_user_group
    user_groups.find_by(parent_id: nil)
  end
end
