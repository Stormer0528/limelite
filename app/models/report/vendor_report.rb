# == Schema Information
#
# Table name: report_vendor_reports
#
#  id              :bigint(8)        not null, primary key
#  start_date      :date
#  end_date        :date
#  data            :jsonb
#  organization_id :bigint(8)
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#
# Indexes
#
#  index_report_vendor_reports_on_organization_id  (organization_id)
#
# Foreign Keys
#
#  fk_rails_...  (organization_id => organizations.id)
#

class Report::VendorReport < ApplicationRecord
  # CALLBACKS
  #-----------------------------------------------------------------------------
  before_create :set_defaults
  after_create :run_report

  # RELATIONSHIPS
  #-----------------------------------------------------------------------------
  belongs_to :organization

  delegate :name, :id, to: :organization, prefix: true
  store_accessor  :data, :vendors, :funds

  QUERY = "SELECT account_funds.code, vendors.id,
          COALESCE(NULLIF(TRIM(vendors.company),''), \
          TRIM(CONCAT(TRIM(vendors.title), ' ', TRIM(vendors.first_name), ' ', \
          vendors.id,
          TRIM(vendors.last_name), ' ', TRIM(vendors.suffix)))) AS vendor_name,
          NULLIF(TRIM(vendors.account_number),'') AS vendor_number,
          SUM(entry_items.amount_in_cents) AS amount_in_cents
          FROM entry_items
          INNER JOIN entries on entries.id = entry_items.entry_id
          INNER JOIN accounts on accounts.id = entry_items.account_id
          INNER JOIN bank_accounts \
          ON accounts.account_object_id = bank_accounts.account_object_id
          INNER JOIN account_funds on account_funds.id = accounts.account_fund_id
          INNER JOIN vendors ON vendors.id = entry_items.payable_id \
          AND entry_items.payable_type = 'Vendor'
          WHERE entry_items.type = 'Credit'
          AND entries.aasm_state = 'approved'
          AND entries.organization_id = ?
          AND entries.date BETWEEN ? AND ?
          AND account_funds.code in (?)
          AND vendors.aasm_state = 'approved'
          GROUP BY account_funds.code, vendors.id
          ORDER BY account_funds.code, vendor_name, vendor_number ASC".freeze

  def set_defaults
    self.start_date ||= Date.today.beginning_of_month
    self.end_date ||= Date.today.end_of_month
  end

  def sani_sql
    Report::VendorReport.send(
      :sanitize_sql,
      [
        Report::VendorReport::QUERY,
        organization.id,
        start_date,
        end_date,
        funds
      ]
    )
  end

  def get_vendors
    Report::VendorReport.connection.select_all(sani_sql).to_a
  end

  def run_report(_should_save=true)
    self.data ||= {vendors: [{code: "", vendor_name: "", vendor_number: "", amount: "", amount_in_cents: 0}]}

    data[:fund_code] = funds.join(', ')
    data[:funds] = funds

    puts 'HERE'
    puts funds.inspect

    should_continue = false
    data[:vendors] = get_vendors.map do |vendor|
      next if should_continue

      record = Vendor.find vendor["id"]

      fiscal_year = FiscalYear.get_year(end_date)
      address = record&.current_ten_ninety_nine(fiscal_year)&.address || record.addresses.first

      phone = ''
      if record&.primary_phone == 'Home'
        phone = record&.home_phone&.number
      elsif record&.primary_phone == 'Mobile'
        phone = record&.mobile_phone&.number
      else
        phone = record&.work_phone&.number
      end

      vendor.merge(amount: Money.new(vendor["amount_in_cents"]).format, address: address.attributes, phone: phone)
    end

    save
  end
end
