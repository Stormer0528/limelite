# == Schema Information
#
# Table name: denial_notifications
#
#  id                :bigint(8)        not null, primary key
#  organization_id   :bigint(8)
#  user_id           :bigint(8)
#  authorizable_type :string
#  authorizable_id   :bigint(8)
#  reason            :string
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#
# Indexes
#
#  authable_deny_items                            (authorizable_type,authorizable_id)
#  index_denial_notifications_on_organization_id  (organization_id)
#  index_denial_notifications_on_user_id          (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (organization_id => organizations.id)
#  fk_rails_...  (user_id => users.id)
#
require 'rails_helper'

RSpec.describe DenialNotification, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
