module Reports
  module ResourceReportable
    extend ActiveSupport::Concern

    # Row Titles
    def resources
      return organization.account_resources unless account_search_params

      codes = account_search_params[:resource_code] || ""
      codes = [codes] unless codes.is_a?(Array)
      res = organization.account_resources
      res = res.where(code: codes) if codes&.present? && codes&.any?(&:present?)
      res
    end

    def restricted_resources
      resources.where(restricted: true).order(:code)
    end

    def unrestricted_resources
      resources.where("restricted IS NULL OR restricted = ?", false).order(:code)
    end

    def unrestricted_resource_titles
      unrestricted_resources.map(&:code) << "Unrestricted"
    end

    def restricted_resource_titles
      restricted_resources.map(&:code) << "Restricted"
    end

    def titles
      [*unrestricted_resource_titles, *restricted_resource_titles]
    end

    def resource_totals(account)
      unrestricted_totals = unrestricted_resources.map do |resource|
        params = resource_search_params(resource)
        account.balance(start_date, end_date, params)
      end

      restricted_totals = restricted_resources.map do |resource|
        params = resource_search_params(resource)
        account.balance(start_date, end_date, params)
      end

      [*unrestricted_totals, calc_total(unrestricted_totals), *restricted_totals, calc_total(restricted_totals)]
    end

    def unrestricted_totals(range)
      unrestricted_resources.map do |resource|
        AccountObject.range_balance(range, organization_id, start_date, end_date, resource_search_params(resource))
      end
    end

    def restricted_totals(range)
      restricted_resources.map do |resource|
        AccountObject.range_balance(range, organization_id, start_date, end_date, resource_search_params(resource))
      end
    end

    def resource_range_totals(range)
      unrestricted_totals = unrestricted_resources.map do |resource|
        AccountObject.range_balance(range, organization_id, start_date, end_date, resource_search_params(resource))
      end

      restricted_totals = restricted_resources.map do |resource|
        AccountObject.range_balance(range, organization_id, start_date, end_date, resource_search_params(resource))
      end

      return [] if ary_empty?(unrestricted_totals) && ary_empty?(restricted_totals)

      [*unrestricted_totals, calc_total(unrestricted_totals), *restricted_totals, calc_total(restricted_totals)]
    end

    def fmt_val(val)
      val.respond_to?(:format) ? val.format : val
    end

    def objects
      organization.account_objects
    end

    def ary_empty?(ary)
      ary.all? {|v| v == " - " }
    end

    def resource_search_params(resource)
      asp = account_search_params || {}
      asp.merge({resource_code: [resource.code]})
    end

    def calc_total(totals)
      totals.inject(Money.new(0)) {|total, balance|
        return Money.new(0) if balance == " - "

        total + balance
      }
    end

    def colspan_width
      titles.length + 3
    end
  end
end
