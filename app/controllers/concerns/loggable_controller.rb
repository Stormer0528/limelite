module LoggableController
  extend ActiveSupport::Concern

  def state_param
    params.require(:commit)
  end

  def reason_text
    params.key?(:state_change_log) ? params.dig(:state_change_log, :reason) : ""
  end

  def update_state(instance)
    return unless state_param

    update_method = state_param.parameterize.underscore

    case update_method
    when "save_draft"
      instance.save
    when "update"
      instance.save
    else
      instance.save if instance.new_record?
      instance.send(
        update_method,
        user_id: @current_user.id,
        user_group_id: @current_user_group&.id,
        reason: reason_text,
        admin: @current_user.admin?
      )
    end

    instance
  end
end
