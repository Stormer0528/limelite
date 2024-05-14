# == Schema Information
#
# Table name: account_resources
#
#  id              :integer          not null, primary key
#  name            :string
#  code            :string
#  organization_id :integer
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  slug            :string
#  restricted      :boolean
#
# Indexes
#
#  index_account_resources_on_code                      (code)
#  index_account_resources_on_code_and_organization_id  (code,organization_id) UNIQUE
#  index_account_resources_on_organization_id           (organization_id)
#
# Foreign Keys
#
#  fk_rails_...  (organization_id => organizations.id)
#

class AccountResource < ApplicationRecord
  include AccountElement

  DEFAULT_CODE = "0000".freeze
end
