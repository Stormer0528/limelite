module Reports
  module AgingReportable
    extend ActiveSupport::Concern

    included do
      # RELATIONSHIPS
      #-----------------------------------------------------------------------------
      belongs_to :organization

      # CALLBACKS
      #-----------------------------------------------------------------------------
      before_create :set_defaults
      after_create :run_report

      # Validations
      #-----------------------------------------------------------------------------
      validates :start_date, presence: true
      validates :end_date, presence: true
    end

    # INSTANCE METHODS
    #-----------------------------------------------------------------------------
    def set_defaults
      self.start_date ||= Date.today.beginning_of_month
      self.end_date ||= Date.today.end_of_month
      self
    end
    
    def period_names
      returnValue = [:current]
      periods.times do |period|
        start_days = (period * days_per_period) + 1
        end_days = (period * days_per_period) + days_per_period
        returnValue << :"#{start_days}-#{end_days}"
      end
      returnValue << :"#{(periods * days_per_period) + 1} and over"
      returnValue
    end

    private

    def period_ranges
      returnValue = {current: [nil,0] }
      periods.times do |period|
        start_days = (period * days_per_period) + 1
        end_days = (period * days_per_period) + days_per_period

        returnValue[:"#{start_days}-#{end_days}"] = [start_days, end_days]
      end
      returnValue[:"91 and over"] = [91,nil]
      returnValue
    end

    def period_dates
      current_start_date = (end_date - days_per_period) + 1
      current_end_date = end_date

      returnValue = {current: [current_start_date, current_end_date] }
      current_end_date = current_start_date - 1

      periods.times do |period|
        start_days = (period * days_per_period) + 1
        end_days = (period * days_per_period) + days_per_period
        current_start_date = current_start_date - days_per_period
        returnValue[:"#{start_days}-#{end_days}"] = [current_start_date, current_end_date]
        current_end_date = current_start_date - 1
      end

      returnValue[:"#{(periods * days_per_period) + 1} and over"] = [start_date, current_end_date]
      returnValue
    end
  end
end
