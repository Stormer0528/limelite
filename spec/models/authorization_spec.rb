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
require 'rails_helper'

RSpec.describe Authorization, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
