# == Schema Information
#
# Table name: account_funds
#
#  id              :integer          not null, primary key
#  name            :string
#  code            :string
#  organization_id :integer
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  slug            :string
#
# Indexes
#
#  index_account_funds_on_code                      (code)
#  index_account_funds_on_code_and_organization_id  (code,organization_id) UNIQUE
#  index_account_funds_on_organization_id           (organization_id)
#
# Foreign Keys
#
#  fk_rails_...  (organization_id => organizations.id)
#

class AccountFund < ApplicationRecord
  include AccountElement

  DEFAULT_CODE = "0000".freeze

  has_many :user_school_assignments, dependent: :destroy
  has_many :users, through: :user_school_assignments
end
