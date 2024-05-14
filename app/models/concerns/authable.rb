module Authable
  extend ActiveSupport::Concern

  included do
    has_many :authorizations, as: :authorizable, dependent: :destroy
    has_many :user_groups, through: :authorizations
  end

  # Set up first auth
  def start_authorization(args)
    group = UserGroup.find(args[:user_group_id])
    return unless group

    # Remove any denial messages
    DenialNotification.where(user_id: args[:user_id], authorizable: self).destroy_all

    authorize(user_id: args[:user_id], user_group_id: args[:user_group_id], action: "Approve")
    setup_next_auth(group.parent) if group.parent
  end

  def authorize(user_id:, user_group_id:, action:, reason: nil)
    authorizations.create user_id: user_id,
                          user_group_id: user_group_id,
                          action: action,
                          reason: reason
  end

  def setup_next_auth(parent_group)
    # create emtpy authorization
    authorizations.create user_group: parent_group
  end

  def handle_auth
    return unless current_auth

    # Send Approval email
    creator.notify_user("success", self)
  end

  def auth_finished?(args)
    return true unless current_auth

    group = UserGroup.find(args[:user_group_id])
    permission = group.module_permissions.dig(record_class)

    return false unless args[:admin] || (["Owner", "Editor"].include?(permission) &&
      (creator.blank? || authorization_path.map(&:id).include?(args[:user_group_id])))

    auth = current_auth || authorizations.new
    auth_approve  user_id: args[:user_id],
                  user_group_id: args[:user_group_id],
                  reason: args[:reason]

    true
  end

  def auth_approve(user_id:, reason:, user_group_id: nil)
    auth = current_auth || authorizations.new

    auth.update user_id: user_id,
                user_group_id: user_group_id,
                reason: reason,
                action: "Approve"
  end

  def handle_deny(args)
    return unless current_auth

    auth_deny(user_id: args[:user_id], user_group_id: args[:user_group_id], reason: args[:reason])
  end

  def auth_deny(user_id:, user_group_id:, reason: nil)
    auth = current_auth || authorizations.new

    auth.update user_id: user_id, user_group_id: user_group_id, reason: reason, action: "Deny"

    # create denial message
    # DenialNotification.create user_id: creator&.id, reason: reason, authorizable: self, organization: organization
    setup_next_auth(creator.user_groups.where(organization: organization).first)

    creator.notify_user("denial", self, reason)

    auth
  end

  def authorized?
    aasm_state == "approved"
  end

  # Returns an array of user_groups starting with the group of the creator
  #   and ending with the admin group at the top of the auth tree
  def authorization_path
    return [] if authorizations.empty?

    creator_group = creator.user_groups.where(organization: organization).first
    return [] unless creator_group

    groups = [creator_group]
    loop do
      current_group = groups.last.parent
      break unless current_group

      groups << current_group

      break if current_group.parent.nil?
    end

    groups
  end

  # Relative Authorizations/Groups
  #-----------------------------------------------------------------------
  def next_auth_group
    current_auth_group.parent
  end

  def current_auth
    authorizations.where(user_id: nil).order(created_at: :desc).first
  end

  def last_auth
    authorizations.where.not(user_id: nil).order(created_at: :desc).first
  end

  def last_auth_group
    last_auth&.user_group
  end

  # Gives the parent of the last group to approve
  # Items which have been denied show the last group to deny authorization
  def current_auth_group
    return nil unless last_auth

    last_auth.action == "Deny" ? last_auth.user_group : last_auth.user_group.parent
  end

  # Permissions
  #------------------------------------------------------------------------
  def record_class
    case self.class.name
    when "BankAccount::Check"
      "BankAccount"
    when "BankAccount::Deposit"
      "BankAccount"
    when "BankAccount::AccountTransfer"
      "BankAccount"
    when "CreditCard::Charge"
      "CreditCard"
    when "CreditCard::Payment"
      "CreditCard"
    when "Invoice"
      invoiceable_type
    when "Entry"
      if journalable_type == "Invoice"
        journalable.invoiceable_type
      elsif bank_account_items.present?
        "BankAccount"
      elsif credit_card_items.present?
        "CreditCard"
      else
        "Account"
      end
    else
      self.class.name
    end
  end
end
