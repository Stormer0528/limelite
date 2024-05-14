# == Schema Information
#
# Table name: batch_uploads
#
#  id                :bigint(8)        not null, primary key
#  total_invoices    :integer
#  critical_invoices :integer
#  notes             :text
#  creator_id        :integer
#  aasm_state        :string
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  organization_id   :bigint(8)
#  data              :json
#
# Indexes
#
#  index_batch_uploads_on_aasm_state       (aasm_state)
#  index_batch_uploads_on_creator_id       (creator_id)
#  index_batch_uploads_on_organization_id  (organization_id)
#
# Foreign Keys
#
#  fk_rails_...  (creator_id => users.id)
#  fk_rails_...  (organization_id => organizations.id)
#

class BatchUpload < ApplicationRecord
  include AASM
  include Loggable
  include Authable
  include Approvable

  belongs_to :organization
  belongs_to :creator, class_name: "User"
  store_accessor :data, :files

  # Pundit Policy
  #---------------------------------------------------------------------------
  def self.policy_class
    StandardPolicy
  end

  validate :files_with_accounts
  validate :accounts_with_account_ids
  validate :files_with_invoice_number

  def files_with_accounts
    temp = data.deep_stringify_keys
    temp["files"].each_with_index do |f, i|
      errors.add(:file, "#{i + 1} must have an account.") if f["accounts"].empty?
    end
  end

  def accounts_with_account_ids
    temp = data.deep_stringify_keys
    temp["files"].map {|f| f["accounts"] }.flatten.each do |a|
      return errors.add(:files, "must have accounts and amounts.") unless a["amount"].positive? && a["account_id"]
    end
  end

  def files_with_invoice_number
    temp = data.deep_stringify_keys
    temp["files"].each_with_index do |f, i|
      if (f.key?("invoiceNumber") && f["invoiceNumber"].blank?) ||
        (f.key?("invoice_number") && f["invoice_number"].blank?)
        errors.add(:file, "#{i + 1} must have an invoice number.")
      end
    end
  end

  # Override default for Batch Uploads
  def auth_finished?(args)
    return true unless current_auth

    group = UserGroup.find(args[:user_group_id])
    permission = group.module_permissions.dig(record_class)

    return false unless args[:admin] || (["Owner", "Editor"].include?(permission) &&
                                         authorization_path.map(&:id).include?(args[:user_group_id]))

    auth = current_auth || authorizations.new
    auth_approve  user_id: args[:user_id],
                  user_group_id: args[:user_group_id],
                  reason: args[:reason]

    files_approved = files.map {|f| f["approved"] }
    files_over_amount = files.map do |f|
      true if group.approval_amount != 0 && group.approval_amount < f["amount"] * 100
    end
    blank_path_files = files.map {|f| true if f["path"] == "#" || f["path"].blank? }

    return false unless files_approved.all?

    if files_over_amount.include?(true)
      setup_next_auth(auth.user_group.parent) unless group.parent.nil?
      return false
    end

    return false if blank_path_files.include?(true)

    true
  end

  def authorization_path
    authorizations.order(created_at: :asc).map(&:user_group)
  end
end
