class GraphqlController < ApplicationController
  def execute
    variables = ensure_hash(params[:variables])
    query = params[:query]
    operation_name = params[:operationName]
    context = {
      # Query context goes here, for example:
      current_user: @current_user,
      current_user_group: @current_user_group,
      current_org: @current_org,
      fiscal_year: @fiscal_year,
      auth_ctx: pundit_user,
      set_fiscal_year: ->(date) { set_fiscal_year date },
      site_path: @site_path
    }

    result = SavantCoSchema.execute(query, variables: variables, context: context, operation_name: operation_name)
    render json: result
  rescue StandardError => e
    raise e unless Rails.env.development?

    handle_error_in_development e
  end

  private

  def set_current_org
    variables = ensure_hash(params[:variables])

    # make sure to get subdomain if localhost
    subdomain_str = request.subdomain(/localhost/ =~ request.domain ? 0 : 1)
    subdomain_str.gsub!(".staging", "")
    @current_org = if subdomain_str.present? && !subdomain_str.casecmp("www").zero?
                     Organization.find_by(subdomain: subdomain_str.downcase)
                   end

    if variables[:organizationId] && variables[:organizationId].to_i > 0
      @current_org = Organization.find(variables[:organizationId])
    end
  end

  # Handle form data, JSON body, or a blank value
  def ensure_hash(ambiguous_param)
    case ambiguous_param
    when String
      if ambiguous_param.present?
        ensure_hash(JSON.parse(ambiguous_param))
      else
        {}
      end
    when Hash, ActionController::Parameters
      ambiguous_param
    when nil
      {}
    else
      raise ArgumentError, "Unexpected parameter: #{ambiguous_param}"
    end
  end

  def handle_error_in_development(e)
    logger.error e.message
    logger.error e.backtrace.join("\n")

    render json: {error: {message: e.message, backtrace: e.backtrace}, data: {}}, status: 500
  end
end
