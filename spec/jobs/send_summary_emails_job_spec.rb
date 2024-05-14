require "rails_helper"

RSpec.describe SendSummaryEmailsJob, type: :job do
  User.each do |user|
    AuthorizationMailer.with(user: user).summary(user: user)
  end
end
