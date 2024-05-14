# == Schema Information
#
# Table name: ap_file_download_logs
#
#  id              :bigint(8)        not null, primary key
#  user_id         :bigint(8)
#  file_upload_id  :bigint(8)
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#
# Indexes
#
#  index_ap_file_download_logs_on_file_upload_id                   (file_upload_id)
#  index_ap_file_download_logs_on_user_id                     (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (file_upload_id => file_uploads.id)
#  fk_rails_...  (user_id => users.id)
#

class ApFileDownloadLog < ApplicationRecord
  belongs_to :user
  belongs_to :file_upload
end
