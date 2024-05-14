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
FactoryBot.define do
  factory :user_group do
    association :organization, factory: :organization

    name { Faker::Company.industry }
  end
end
