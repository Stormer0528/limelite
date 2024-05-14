# == Schema Information
#
# Table name: report_vendor1099_reports
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
#  index_report_vendor1099_reports_on_organization_id  (organization_id)
#
# Foreign Keys
#
#  fk_rails_...  (organization_id => organizations.id)
#

class Report::Vendor1099Report < ApplicationRecord
  # CALLBACKS
  #-----------------------------------------------------------------------------
  after_create :run_report

  # RELATIONSHIPS
  #-----------------------------------------------------------------------------
  belongs_to :organization

  delegate :name, :id, to: :organization, prefix: true, allow_nil: true
  store_accessor  :data, :vendors

  def run_report(should_save=true)
    self.data ||= {}
    data[:vendors] = []

    grouped_vendors.each_value do |group|
      vendor_total = Money.new 0
      group.each do |vendor|
        cash_account_codes = organization.bank_accounts.map {|ba| ba.account_object&.code }
        entry_items = vendor.entry_items
                            .dated_before(end_date)
                            .dated_after(start_date)
                            .approved
                            .by_code(:object, cash_account_codes)
                            .where.not(entry_items: {accounts: {account_objects: {code: 4000}}})

        # Need both credits and debits, in case things are re
        year_amount = entry_items.inject(Money.new(0)) do |total, ei|
          if ei.type == "Credit"
            total + ei.amount.abs
          else
            total - ei.amount.abs
          end
        end

        year_amount += vendor.starting_balance if vendor.start_date && vendor.start_date >= start_date
        vendor_total += year_amount
      end

      vendor = group.first
      data[:vendors] << { \
        name: vendor.name,
        type: vendor.current_ten_ninety_nine.ein_type,
        ssn_ein: vendor.current_ten_ninety_nine.ein,
        address: vendor.current_ten_ninety_nine.address&.to_text,
        year_amount: vendor_total.format
      }
    end

    save if should_save
  end

  def available_vendors
    organization.vendors
                .joins(:ten_ninety_nines)
                .includes(:ten_ninety_nines)
                .where(ten_ninety_nines: {required: true})
                .order("ten_ninety_nines.year DESC")
  end

  def grouped_vendors
    available_vendors
      .filter { |v| !v.current_ten_ninety_nine.nil? }
      .group_by { |v| v.current_ten_ninety_nine.ein.gsub(/[^0-9]/, "") }
  end
end
