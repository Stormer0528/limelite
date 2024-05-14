class AuthorizationMailer < ApplicationMailer
  default from: "noreply@limeliteds.com"

  def notification(user:, item:)
    @user = user
    @item = item
    @item_name = item.class.name.titleize
    @item_url = vendor_purchase_order_url(item.vendor, item)

    mail(to: @user.email, subject: "#{@item_name} requires your authorization")
  end

  def success(user:, item:)
    @user = user
    @item = item
    @item_name = item.class.name.titleize
    @item_url = vendor_purchase_order_url(item.vendor, item)

    mail(to: @user.email, subject: "#{@item_name} requires your authorization")
  end

  def denial(user:, item:, reason:)
    @user = user
    @item = item
    @reason = reason
    @item_name = item.class.name.titleize
    @item_url = vendor_purchase_order_url(item.vendor, item)

    mail(to: @user.email, subject: "#{@item_name} requires your authorization")
  end

  def summary(user:, path: "limeliteds.com")
    @user = user
    @path = path
    mail(to: @user.email, subject: "Authorizations requiring your attention")
  end
end
