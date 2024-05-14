# == Schema Information
#
# Table name: user_groups
#
#  id                 :bigint(8)        not null, primary key
#  name               :string
#  parent_id          :bigint(8)
#  organization_id    :bigint(8)
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#  module_permissions :jsonb            not null
#
# Indexes
#
#  index_user_groups_on_module_permissions  (module_permissions) USING gin
#  index_user_groups_on_organization_id     (organization_id)
#  index_user_groups_on_parent_id           (parent_id)
#
# Foreign Keys
#
#  fk_rails_...  (organization_id => organizations.id)
#  fk_rails_...  (parent_id => user_groups.id)
#
class UserGroup < ApplicationRecord
  # Relationships
  belongs_to :organization
  belongs_to :parent, class_name: "UserGroup", optional: true

  has_many :children, class_name: "UserGroup", foreign_key: "parent_id"

  has_many :user_groups, through: :parent, as: :siblings
  has_many :user_group_assignments, class_name: "UserGroupAssignment", dependent: :destroy
  accepts_nested_attributes_for :user_group_assignments, allow_destroy: true

  has_many :authorizations
  accepts_nested_attributes_for :authorizations, allow_destroy: true

  has_many :users, through: :user_group_assignments

  validates :name, uniqueness: {scope: [:organization_id, :parent_id]}

  store_accessor :module_permissions, :approval_amount

  # Scopes
  #---------------------------------------------------------------------------
  default_scope -> { where(archived: [false, nil]) }
  scope :unarchived, -> { where(archived: [false, nil]) }
  scope :archived, -> { where(archived: true) }

  # Pundit Policy
  #---------------------------------------------------------------------------
  def self.policy_class
    StandardPolicy
  end

  def parents
    ret = [parent]
    ret << ret.last.parent until ret.last.nil? || ret.include?(ret.last.parent)

    ret.compact
  end

  def archive
    # Update Children
    children.update parent_id: parent_id

    if authorizations.count > 0
      update archived: true
    else
      destroy
    end

    true
  end

  def items_awaiting_authorization
    # Items created by users without approvals
    pos = PurchaseOrder.where(
      aasm_state: :needs_approval,
      creator_id: users.map(&:id)
    ).reject {|item| item.authorizations.where(user_group_id: id).any? }

    uploads = BatchUpload.where(
      aasm_state: :needs_approval,
      creator_id: users.map(&:id)
    ).reject {|item| item.authorizations.where(user_group_id: id).any? }

    approved_child_items = Authorization.where(user_group_id: children.map(&:id),
                                               authorizable_type: Authorization::AUTHABLE_TYPES)
                                        .includes(authorizable: [:authorizations])
                                        .map(&:authorizable)
                                        .reject {|item|
      item.nil? || item.authorizations.where(user_group_id: id).any?
    }
    [*pos, *uploads, *approved_child_items].compact
  end

  def admin?
    parent.nil?
  end

  def approval_amount
    module_permissions["approval_amount"]
  end
end
