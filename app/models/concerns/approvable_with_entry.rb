module ApprovableWithEntry
  extend ActiveSupport::Concern

  # Entry states
  #-----------------------------------------------------------------------------
  def send_entry_for_approval(*args)
    save
    entry.send_for_approval(*args) if entry&.may_send_for_approval?(*args)
  end

  def approve_entry(*args)
    save
    entry.approve(*args) if entry&.may_approve?(*args)
  end

  def deny_entry(*args)
    save
    entry.deny(*args) if entry&.may_deny?(*args)
  end

  def reverse_entry_approval(*args)
    save
    entry.reverse_approval(*args) if entry&.may_reverse_approval?(*args)
  end

  included do
    # State Machine
    #-----------------------------------------------------------------------------
    aasm whiny_transitions: false do
      state :draft, initial: true
      state :needs_approval, :approved, :needs_revision

      after_all_transitions :log_status_change

      event :send_for_approval, after: proc {|*args| send_entry_for_approval(*args) } do
        transitions from: [:draft, :needs_revision],
                    to: :approved,
                    guard: proc {|args| args&.dig(:admin) }
        transitions from: [:draft, :needs_revision],
                    to: :needs_approval,
                    after: proc {|args| start_authorization(args) }
      end

      event :approve, after: proc {|*args| approve_entry(*args) } do
        transitions from: :needs_approval,
                    to: :approved,
                    after: :handle_auth,
                    guard: proc {|args| auth_finished?(args) }
      end

      event :deny, after: proc {|*args| deny_entry(*args) } do
        transitions from: :needs_approval, to: :needs_revision, after: proc {|args| handle_deny(args) }
      end

      event :reverse_approval, after: proc {|*args| reverse_entry_approval(*args) } do
        transitions from: :approved, to: :needs_revision
      end
    end
  end
end
