module Loggable
  extend ActiveSupport::Concern

  included do
    has_many :state_change_logs, as: :loggable, class_name: "StateChangeLog", dependent: :destroy
  end

  def approved_at
    state_change_logs.order(created_at: :desc).first&.updated_at
  end

  def approver_name
    state_change_logs.order(created_at: :desc).first&.user&.full_name
  end

  def log_status_change(args)
    return if aasm.current_event.to_s == "save_draft"

    state_change_logs.send (persisted? ? :create : :new), from_state: aasm.from_state,
                                                          to_state: aasm.to_state,
                                                          event: aasm.current_event,
                                                          user_id: args[:user_id],
                                                          reason: args&.dig(:reason) || ""
  end
end
