# == Schema Information
#
# Table name: account_years
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
#  index_account_years_on_code                      (code)
#  index_account_years_on_code_and_organization_id  (code,organization_id) UNIQUE
#  index_account_years_on_organization_id           (organization_id)
#
# Foreign Keys
#
#  fk_rails_...  (organization_id => organizations.id)
#

class AccountYear < ApplicationRecord
  include AccountElement

  DEFAULT_CODE = "0".freeze
end
