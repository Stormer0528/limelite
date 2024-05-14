# Preview all emails at http://localhost:3000/rails/mailers/authorization_mailer
class AuthorizationMailerPreview < ActionMailer::Preview
  def notification; end

  def success; end

  def denial; end

  def summary
    @user = User.all.sample
    AuthorizationMailer.with(user: @user).summary(user: @user, path: "localhost:3000")
  end
end
