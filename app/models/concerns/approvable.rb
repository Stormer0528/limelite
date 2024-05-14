module Approvable
  extend ActiveSupport::Concern

  included do
    # State Machine
    #-----------------------------------------------------------------------------
    aasm whiny_transitions: false do
      state :draft, initial: true
      state :needs_approval, :approved, :needs_revision

      after_all_transitions :log_status_change

      event :send_for_approval, after: :save do
        transitions from: [:draft, :needs_revision],
                    to: :approved,
                    guard: proc {|args| args&.dig(:admin) }
        transitions from: [:draft, :needs_revision, :needs_revision],
                    to: :needs_approval,
                    after: proc {|args| start_authorization(args) }
      end

      event :approve, after: :save do
        transitions from: :needs_approval,
                    to: :approved,
                    after: :handle_auth,
                    guard: proc {|args| auth_finished?(args) }
      end

      event :deny, after: proc { save(validate: false) } do
        transitions from: :needs_approval,
                    to: :needs_revision,
                    after: proc {|args| handle_deny(args) }
      end

      event :reverse_approval, after: :save do
        transitions from: :approved, to: :needs_revision
      end
    end
  end
end
