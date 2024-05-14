module Concerns::ApprovableWithLog
  extend ActiveSupport::Concern

  included do
    field :approved_at,    String,  null: true
    field :approver,       String,  null: true

    field :state_change_logs, [Types::StateChangeLogType], null: false

    def approved_at
      object.approved_at&.to_formatted_s(:long)
    end

    def approver
      object.approver_name
    end
  end
end
