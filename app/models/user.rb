# == Schema Information
#
# Table name: users
#
#  id                     :integer          not null, primary key
#  first_name             :string           default(""), not null
#  last_name              :string           default(""), not null
#  email                  :string           default(""), not null
#  super_admin            :boolean          default(FALSE), not null
#  encrypted_password     :string           default(""), not null
#  reset_password_token   :string
#  reset_password_sent_at :datetime
#  remember_created_at    :datetime
#  sign_in_count          :integer          default(0), not null
#  current_sign_in_at     :datetime
#  last_sign_in_at        :datetime
#  current_sign_in_ip     :inet
#  last_sign_in_ip        :inet
#  confirmation_token     :string
#  confirmed_at           :datetime
#  confirmation_sent_at   :datetime
#  unconfirmed_email      :string
#  failed_attempts        :integer          default(0), not null
#  unlock_token           :string
#  locked_at              :datetime
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#  back_office            :boolean          default(FALSE)
#  avatar_url             :string
#  slug                   :string
#  archived               :boolean
#  preferences            :jsonb
#  ap                     :boolean          default(FALSE)
#  upload_only            :boolean          default(FALSE)
#
#
# Indexes
#
#  index_users_on_confirmation_token    (confirmation_token) UNIQUE
#  index_users_on_email                 (email) UNIQUE
#  index_users_on_reset_password_token  (reset_password_token) UNIQUE
#  index_users_on_slug                  (slug)
#  index_users_on_unlock_token          (unlock_token) UNIQUE
#

class User < ApplicationRecord
  extend FriendlyId
  include FileUploadable

  friendly_id :slug_candidates, use: [:slugged]

  # DEVISE
  #-----------------------------------------------------------------------------
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable, :confirmable, :lockable,
         :recoverable, :rememberable, :trackable, :validatable, :timeoutable,
         password_length: 10..255

  # SCOPES
  #-----------------------------------------------------------------------------
  scope :admin, -> { where('("users"."super_admin" = ? OR "users"."back_office" = ?)', true, true) }
  scope :non_admin, -> { where('("users"."super_admin" = ? AND "users"."back_office" = ?)', false, false) }
  scope :by_partial_email, ->(email) { where("users.email ILIKE ?", "%#{email}%") }
  scope :by_partial_name, ->(name) { where("(CONCAT(users.first_name, users.last_name) ILIKE ?)", "%#{name}%") }
  scope :by_type, ->(type) { joins(:organization_assignments).where(organization_assignments: {type: type}) }
  scope :by_role, ->(role) { joins(:organization_assignments).where(organization_assignments: {role: role}) }
  scope :by_organization, ->(organization_id) {
                            joins(:organization_assignments).where(organization_assignments: {organization_id: organization_id})
                          }
  scope :unarchived, -> { where(archived: [false, nil]) }
  scope :archived, -> { where(archived: true) }

  # RELATIONSHIPS
  #-----------------------------------------------------------------------------
  has_many :organization_assignments, dependent: :destroy
  has_many :organizations, through: :organization_assignments

  has_many :owner_assignments, dependent: :destroy
  has_many :owned_organizations,
           through: :owner_assignments,
           source: :organization

  has_many :editor_assignments, dependent: :destroy
  has_many :editable_organizations,
           through: :editor_assignments,
           source: :organization

  has_many :viewer_assignments, dependent: :destroy
  has_many :viewable_organizations,
           through: :viewer_assignments,
           source: :organization

  has_many :user_group_assignments, dependent: :destroy
  has_many :user_groups, through: :user_group_assignments
  has_many :authorizations, dependent: :destroy
  has_many :denial_notifications, dependent: :destroy

  has_many :vendors, foreign_key: "creator_id", class_name: "Vendor"

  has_many :user_school_assignments, dependent: :destroy
  has_many :account_funds, through: :user_school_assignments

  # File Uploads
  has_many :file_uploads, as: :uploadable, class_name: "FileUpload"

  # VALIDATIONS
  #-----------------------------------------------------------------------------
  validates :first_name, presence: true
  validates :last_name, presence: true
  validates :email, presence: true, uniqueness: {allow_nil: false}
  validates :password,
            unless: -> { persisted? && password.blank? && password_confirmation.blank? },
            password_strength: {
              min_entropy: 16,
              message: "is not complex enough (must have 1 uppercase, 1 lowercase letter and 1 number or symbol)"
            }

  # Pundit Policy
  #---------------------------------------------------------------------------
  def self.policy_class
    AdminUsersPolicy
  end

  # Instance Methods
  #-----------------------------------------------------------------------------
  def accessible_funds(organization_id=nil)
    if super_admin?
      if organization_id.nil?
        AccountFund.all
      else
        AccountFund.where(organization_id: organization_id)
      end
    else
      if organization_id.nil?
        account_funds
      else
        account_funds.where(organization_id: organization_id)
      end
    end
  end

  def username
    email
  end

  def full_name
    [first_name, last_name].join(" ").titleize
  end

  def initials
    [first_name&.first, last_name&.first].join.upcase
  end

  def confirmed
    confirmed?
  end

  def confirmed=(value)
    attributes["confirmed_at"] = DateTime.now if value == "1"
  end

  def organization_role(organization_id=nil)
    organization_assignments.find_by(organization_id: organization_id)&.role || "None"
  end

  def organization_type(organization_id=nil)
    organization_assignments.find_by(organization_id: organization_id)&.type || "None"
  end

  def set_organization_role(organization_id, type="viewer", role="None", permissions={})
    assignment = organization_assignments.find_or_initialize_by(organization_id: organization_id)
    assignment.update_attributes role: role, type: "#{type.capitalize}Assignment", permissions: permissions
    assignment.save(validate: false)
    assignment
  end

  def password_required?
    false
  end

  def organizations
    return Organization.all if super_admin?

    super
  end

  def user_groups
    return UserGroup.where(parent_id: nil) if admin?

    super
  end

  # Check permissions based on organization_assignment_role
  def check_permission(org_id, model, perm, assignment=nil)
    assignment ||= organization_assignments.find_by(organization_id: org_id)
    return false unless assignment

    assignment.check_permission(model, perm)
  end

  def admin?
    super_admin? || back_office?
  end

  def slug_candidates
    [:full_name, :initials]
  end

  def created_authorizables(organization_id)
    Authorization::AUTHABLE_TYPES.map {|type|
      type.constantize.where(organization_id: organization_id, creator: self)
    }.flatten
  end

  def authorizable_items(organization_id)
    group = user_groups.where(organization_id: organization_id)
    organization = organizations.find_by(id: organization_id)

    return [] unless organization

    auth_ctx = AuthorizationContext.new(self, organization, group.first)
    auth_groups = Authorization.where(user_id: nil,
                                      user_group: group).group_by(&:authorizable_type).map do |auth_type, items|
      # policy class
      klass = auth_type.constantize
      policy = klass.policy_class.new auth_ctx, items.first&.authorizable

      # check auth
      next unless policy.edit?

      # get items
      klass.where(id: items.map(&:authorizable_id)).where.not(aasm_state: :approved)
    rescue NameError
      next
    end

    auths = auth_groups.flatten.compact.sort_by(&:created_at).reverse

    [*auths, *denial_notifications.to_a].compact
  end

  def notify_user(message_type, item, reason=nil)
    pref = preferences.dig("email_notifications")
    AuthorizationMailer.send(message_type, user: self, item: item, reason: reason).deliver_later if pref == "all"
  end
end
