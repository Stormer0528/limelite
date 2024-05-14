# == Schema Information
#
# Table name: state_change_logs
#
#  id            :bigint(8)        not null, primary key
#  user_id       :bigint(8)
#  loggable_type :string
#  loggable_id   :bigint(8)
#  reason        :text
#  from_state    :string
#  to_state      :string
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  event         :string
#
# Indexes
#
#  index_state_change_logs_on_created_at                     (created_at)
#  index_state_change_logs_on_loggable_type_and_loggable_id  (loggable_type,loggable_id)
#  index_state_change_logs_on_updated_at                     (updated_at)
#  index_state_change_logs_on_user_id                        (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#

require 'rails_helper'

RSpec.describe StateChangeLog, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
