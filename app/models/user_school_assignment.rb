# == Schema Information
#
# Table name: user_school_assignment
#
#  id                 :bigint(8)        not null, primary key
#  user_id    :bigint(8)
#  organization_id    :bigint(8)
#  account_fund_id    :bigint(8)
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#
# Indexes
#
#  index_user_school_assignments_on_account_fund_id  (account_fund_id)
#  index_user_school_assignments_on_organization_id  (organization_id)
#  index_user_school_assignments_on_user_id (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (organization_id => organizations.id)
#  fk_rails_...  (user_id => users.id)
#  fk_rails_...  (account_fund_id => account_funds.id)
#

class UserSchoolAssignment < ApplicationRecord
  belongs_to :user
  belongs_to :organization
  belongs_to :account_fund
end
