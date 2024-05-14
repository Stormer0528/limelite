# == Schema Information
#
# Table name: report_ar_aging_reports
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
#  index_report_ar_aging_reports_on_organization_id  (organization_id)
#

class Report::ArAgingReport < ApplicationRecord
  include Reports::AgingReportable

  store_accessor :data, :customers_by_period, :periods_by_customer, :funds

  # INSTANCE METHODS
  #-----------------------------------------------------------------------------
  def run_report(should_save=true)
    set_defaults
    return unless valid?

    self.data ||= Hash.new

    self.data["fund_code"] = funds.join(', ')
    self.data["funds"] = funds
    self.data["customers_by_period"] = customers_by_period
    self.data["periods_by_customer"] = periods_by_customer

    self.save if should_save
  end

  def customers_by_period
    Hash[
      period_dates.map {|period, dates|
        [
          period.to_sym,
          organization.customers.map do |customer|
            invoices = []
            customer.invoice_due_during(dates.first, dates.last).each do |invoice|
              invoices << { \
                name:             customer.name,
                date:             invoice.date.to_formatted_s(:std),
                number:           invoice.number,
                transaction_type: "Invoice",
                due_date:         invoice.due_date.to_formatted_s(:std),
                past_due:         (Date.today - invoice.due_date).to_i,
                amount:           invoice.amount.to_f,
                open_balance:     invoice.amount_remaining.to_f \
              } if invoice.amount_remaining.to_f > 0.0
            end
            invoices
          end.inject([]) {|ary, ary2| ary.concat(ary2)}
        ]
      }
    ]
  end

  def periods_by_customer
    Hash[
      organization.customers.map do |customer|
        [customer.id,
          { name: customer.name,
            periods: Hash[period_dates.map {|period, dates| [
                period.to_sym,
                customer.invoice_due_during(dates.first, dates.last).map(&:amount_remaining).inject(0,&:+).to_f
              ]
            }],
            total_balance: customer.invoice_due_during(start_date, end_date).map(&:amount_remaining).inject(0,&:+).to_f}
        ]
      end
    ]
  end
end
