# == Schema Information
#
# Table name: authorizations
#
#  id                :bigint(8)        not null, primary key
#  user_id           :bigint(8)
#  user_group_id     :bigint(8)
#  authorizable_type :string
#  authorizable_id   :bigint(8)
#  action            :string
#  reason            :string
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#
# Indexes
#
#  index_authorizations_on_authorizable_type_and_authorizable_id  (authorizable_type,authorizable_id)
#  index_authorizations_on_user_group_id                          (user_group_id)
#  index_authorizations_on_user_id                                (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_group_id => user_groups.id)
#  fk_rails_...  (user_id => users.id)
#
class Authorization < ApplicationRecord
  belongs_to :user, optional: true
  belongs_to :user_group
  belongs_to :authorizable, polymorphic: true

  default_scope { order(:created_at) }

  AUTHABLE_TYPES = ["Entry", "PurchaseOrder", "BatchUpload", "Customer", "Vendor", "Invoice", "BankAccount", "CreditCard",
                    "BankAccount::Check", "BankAccount::Deposit", "BankAccount::AccountTransfer", "CreditCard::Charge", "CreditCard::Payment"].freeze

  # Validations
  # validate :validate_user_in_group
  # validate :validate_group_can_validate

  def validate_user_in_group
    auth_group = authorizable.next_auth_group

    unless auth_group
      errors.add :this_item, "has already been authorized"
      # remove duplicate validation error
      errors.delete(:user_group)
      return
    end

    unless auth_group&.users&.find_by(id: user.id)
      errors.add :authorization_user, "does not have permission to authorize for this group"
    end
  end

  def validate_group_can_validate
    unless authorizable.next_auth_group == user_group
      errors.add :authorization_group, "does not have permission to approve this item"
    end
  end
end
