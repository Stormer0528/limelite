##
# Common functions for All Reports
module Reports
  module Reportable
    extend ActiveSupport::Concern

    def set_defaults
      start_date ||= Date.today.beginning_of_month
      end_date ||= Date.today.end_of_month
    end

    def get_account_funds
      filter_val = data&.with_indifferent_access.dig(:account_search_params, :fund_code) || []

      if filter_val.is_a? String
        filter_val = filter_val.split(',')
        filter_val = filter_val.map { |val| val =~ /\.\.\.|-/ ? Range.new(*val.split(/\.\.\.|-/).map(&:to_i)) : val }
      end

      filter_val = filter_val.reject(&:blank?)

      if filter_val.present?
        organization.account_funds.where(code: filter_val).order(Arel.sql('code::integer ASC'))
      else
        organization.account_funds.order(Arel.sql('code::integer ASC'))
      end
    end

    def account_fund_name
      (data&.with_indifferent_access&.dig(:account_funds) || []).map { |fund| fund[:name] }.join(', ')
    end

    def account_fund_code
      (data&.with_indifferent_access&.dig(:account_funds) || []).map { |fund| fund[:code] }.join(', ')
    end

    def account_fund_id
      (data&.with_indifferent_access&.dig(:account_funds) || []).map { |fund| fund[:id] }.join(', ')
    end

    def parse_list_range_field(filter_val)
      if filter_val.is_a? String
        filter_val = filter_val.split(',').map(&:strip)
        filter_val = filter_val.map { |val| val =~ /\.\.\.|-/ ? Range.new(*val.split(/\.\.\.|-/).map(&:to_i)) : val }
      end

      filter_val
    end

    def parse_element_w_range(filter_val)
      if filter_val.is_a? String
        filter_val = filter_val.split(',').map(&:strip)
        filter_val = filter_val.map { |val| val =~ /\.\.\.|-/ ? Range.new(*val.split(/\.\.\.|-/).map(&:to_i)).map(&:to_s) : val }
        filter_val.flatten!
        filter_val.uniq!
      end

      filter_val

    end

    def parse_num(num)
      num = num.gsub(/[$,]/, '') if num.is_a? String
      num.to_f
    end

    def parse_amount(num)
      Money.from_amount(parse_num(num))
    end

    def view_table_name(infix = 'view')
      prefix = self.class.name.demodulize.underscore
      # view_key is assigned in setup. must be the same for all calls so tables can be added/dropped

      # Generate random key for table views
      # Note: key must be lowercase
      @view_key ||= SecureRandom.alphanumeric(9).downcase

      postfix = [organization.id, @view_key].join('_')

      [prefix, infix, postfix].join('_')
    end

    ##
    # A default setup function for common reports
    #
    # - sets data
    # - parses account values if present
    # - sets titles, fund_name and fund_code
    #
    # also takes a block for custom setup

    def setup
      self.data ||= {}
      data[:account_funds] = get_account_funds
      data[:fund_code]     = account_fund_code
      data[:fund_name]     = account_fund_name

      data[:account_elements] = account_search_params

      data[:titles] = titles

      yield
    end
  end
end
