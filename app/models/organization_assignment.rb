# == Schema Information
#
# Table name: organization_assignments
#
#  id              :integer          not null, primary key
#  user_id         :integer
#  organization_id :integer
#  type            :string
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  role            :string           default("None"), not null
#  permissions     :jsonb            not null
#
# Indexes
#
#  index_organization_assignments_on_organization_id              (organization_id)
#  index_organization_assignments_on_organization_id_and_user_id  (organization_id,user_id)
#  index_organization_assignments_on_permissions                  (permissions) USING gin
#  index_organization_assignments_on_user_id                      (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (organization_id => organizations.id)
#  fk_rails_...  (user_id => users.id)
#

class OrganizationAssignment < ApplicationRecord
  ROLES = ["None", "AP Clerk", "Staff Accountant", "Controller", "Call Requestor"].freeze

  # Associations
  #-----------------------------------------------------------------------------
  belongs_to :user
  validates_associated :user

  belongs_to :organization
  validates_associated :organization

  # Validations
  #-----------------------------------------------------------------------------
  validates :user_id, presence: true, numericality: true
  validates :organization_id, presence: true, numericality: true

  # Permissions Objects
  #-----------------------------------------------------------------------------
  def self.ap_clerk_permissions
    {
      check: {
        save_draft: true,
        send_for_approval: true,
        approve: false,
        deny: false,
        reverse_approval: false,
        # Check Printing
        print: true,
        void: true
      },
      standard_role: {
        save_draft: true,
        send_for_approval: true,
        approve: false,
        deny: false,
        reverse_approval: false
      }
    }
  end

  def self.staff_accountant_permissions
    {
      check: {
        save_draft: true,
        send_for_approval: true,
        approve: true,
        deny: true,
        reverse_approval: true,
        # Check Printing
        print: true,
        void: true
      },
      standard_role: {
        save_draft: true,
        send_for_approval: true,
        approve: true,
        deny: true,
        reverse_approval: true
      }
    }
  end

  def self.controller_permissions
    {
      check: {
        save_draft: true,
        send_for_approval: true,
        approve: true,
        deny: true,
        reverse_approval: true,
        # Check Printing
        print: true,
        void: true
      },
      standard_role: {
        save_draft: true,
        send_for_approval: true,
        approve: true,
        deny: true,
        reverse_approval: true
      }
    }
  end

  def self.call_requestor_permissions
    {
      report: {
        view: false,
        create: false,
        index: false
      },
      purchase_order: {
        save_draft: true,
        send_for_approval: true,
        approve: false,
        deny: false,
        reverse_approval: false
      },
      check: {
        save_draft: true,
        send_for_approval: false,
        approve: false,
        deny: false,
        reverse_approval: false,
        # Check Printing
        print: false,
        void: false
      },
      vendor: {
        save_draft: true
      },
      standard_role: {
        save_draft: false,
        send_for_approval: false,
        approve: false,
        deny: false,
        reverse_approval: false
      }
    }
  end

  def self.custom_permissions
    permissions
  end

  def self.none_permissions
    {
      check: {},
      invoice: {},
      standard_role: {}
    }
  end

  def check_permission(model, permission)
    perms = self.class.send(:"#{role.parameterize.underscore}_permissions") || {}
    perms.dig(model.to_sym, permission.to_sym)
  end
end
