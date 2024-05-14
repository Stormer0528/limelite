# == Schema Information
#
# Table name: report_ap_aging_reports
#
#  id                  :bigint(8)        not null, primary key
#  start_date          :date
#  end_date            :date
#  aging_method        :string           default("CURRENT")
#  days_per_period     :integer          default(30)
#  show_active_columns :boolean          default(TRUE)
#  show_active_rows    :boolean          default(TRUE)
#  periods             :integer          default(3)
#  data                :jsonb
#  organization_id     :bigint(8)
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#
# Indexes
#
#  index_report_ap_aging_reports_on_organization_id  (organization_id)
#

class Report::ApAgingReport < ApplicationRecord
  include Reports::AgingReportable

  store_accessor  :data, :funds

  # INSTANCE METHODS
  #-----------------------------------------------------------------------------
  def vendor_invoices
    @vendor_invoices ||= organization.invoices.joins(:entry).includes(:invoiceable).dated_after(start_date).dated_before(end_date).unpaid_before(end_date).group_by(&:vendor).select { |vendor, invoices|
      !vendor.nil?
    }
  end

  def run_report(should_save=true)
    set_defaults
    return unless valid?

    self.data ||= {}

    self.data["fund_code"] = funds.join(', ')
    self.data["funds"] = funds
    self.data["vendors_by_period"] = vendors_by_period
    self.data["periods_by_vendor"] = periods_by_vendor

    save if should_save
  end

  private

  def vendors_by_period
    period_ranges.map {|period, range|
      [
        period.to_sym,
        vendor_invoices.map do |vendor, invoices|
          array = []
          invoices.each do |invoice|
            days = (end_date - invoice.due_date).to_i

            next unless (range[0] ? days >= range[0] : true) && (range[1] ? days <= range[1] : true)

            invoice.entry_items.select {|item|
              item.type == "Credit"
            }.group_by(&:account_fund).each do |fund, items|
              array << { \
                name: vendor.name,
                date: invoice.date&.to_formatted_s(:std),
                number: invoice.number,
                transaction_type: "Invoice",
                due_date: invoice.due_date&.to_formatted_s(:std),
                past_due: invoice.due_date ? (end_date - invoice.due_date).to_i : 0,
                amount: items.inject(Money.new(0)) {|total, item| total + item.amount }.to_f,
                open_balance: items.inject(Money.new(0)) {|total, item| total + item.amount }.to_f,
                code: fund.code,
                fund_name: fund.name
              }
            end
          end
          array
        end
                       .inject([]) {|ary, ary2| ary.concat(ary2) }
                       .group_by {|invoice| invoice[:code] }
      ]
    }.to_h
  end

  def periods_by_vendor
    vendor_invoices.map do |vendor, invoices|
      period_hash = vendor_summary_for_period(period_ranges, vendor, invoices)

      [
        vendor.id,
        {
          name: vendor.display_name,
          periods: period_hash,
          total_balance: period_hash.values.inject(Money.new(0)) {|total, value|
                           Money.from_amount(value) + total
                         }.to_f,
          balance_by_account: vendor_totals_by_account_fund(period_ranges, invoices)
        }
      ]
    end.to_h
  end

  def vendor_summary_for_period(period_ranges, _vendor, invoices)
    period_ranges.map {|period, range|
      vendor_remaining_total = invoices.select {|invoice|
        days = (end_date - invoice.due_date).to_i

        (range[0] ? days >= range[0] : true) && (range[1] ? days <= range[1] : true)
      }.map(&:amount).inject(0, &:+).to_f

      [
        period.to_sym,
        vendor_remaining_total
      ]
    }.to_h
  end

  def vendor_totals_by_account_fund(period_ranges, invoices)
    grouped_invoices = invoices.group_by {|invoice| invoice.due_date }
    total_periods_by_fund = []

    grouped_invoices.each do |due_date, invoices|
      items = invoices.map(&:entry_items).flatten.select {|item| item.type == "Credit" }
      fund_items = items.group_by(&:account_fund)

      fund_items.each do |fund, items|
        periods = period_ranges.map {|_period, range|
          days = (end_date - due_date).to_i

          if (range[0] ? days >= range[0] : true) && (range[1] ? days <= range[1] : true)
            items.map(&:amount).inject(0, &:+).to_f
          else
            0.0
          end
        }
        periods_w_total = periods << periods.inject(0) {|sum, period| sum + period }
        total_periods_by_fund << {"#{fund.code} - #{fund.name}": periods_w_total}
      end
    end
    total_periods_by_fund
  end
end
