class SendSummaryEmailsJob < ApplicationJob
  queue_as :default

  def perform(*_args)
    User.all.each do |user|
      AuthorizationMailer.summary(user: user).deliver_later
    end
  end
end
