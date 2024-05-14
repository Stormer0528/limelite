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

class StateChangeLog < ApplicationRecord
  belongs_to :user
  belongs_to :loggable, polymorphic: true

  belongs_to :invoice, -> { where(state_change_logs: {loggable_type: 'Invoice'}) }, foreign_key: 'loggable_id', optional: true

  def invoice
    return unless loggable_type == "Invoice"
    super
  end
end
