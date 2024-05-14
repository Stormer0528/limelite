module ApplicationHelper
  def active_class(link_path, class_name: "active")
    current_page?(link_path) ? class_name : ""
  end

  def icon(icon_type)
    "<i class='fa #{icon_type}'></i>".html_safe
  end

  def ma_icon(icon_type, icon_options: "")
    "<i class='material-icons #{icon_options}'>#{icon_type}</i>".html_safe
  end

  def disabled_checkbox(label, checked)
    content_tag "p", class: "disabled-checkbox" do
      t = tag(:input, type: "checkbox", disabled: true, checked: checked, name: label)
      l = content_tag("label", label, for: "label", class: "checkbox-label")
      t + l
    end
  end

  def class_icon(class_name, icon_options: "")
    case class_name.to_s.downcase.singularize
    when "admin"
      ma_icon "lock_outline", icon_options: icon_options
    when "vendor"
      ma_icon "store", icon_options: icon_options
    when "account"
      ma_icon "chrome_reader_mode", icon_options: icon_options
    when "fund"
      ma_icon "attach_money", icon_options: icon_options
    when "function"
      ma_icon "functions", icon_options: icon_options
    when "goal"
      ma_icon "wifi_tethering", icon_options: icon_options
    when "location"
      ma_icon "location_on", icon_options: icon_options
    when "object"
      ma_icon "web_asset", icon_options: icon_options
    when "resource"
      ma_icon "vignette", icon_options: icon_options
    when "year"
      ma_icon "date_range", icon_options: icon_options
    when "organization"
      ma_icon "account_balance", icon_options: icon_options
    when "user"
      ma_icon "supervisor_account", icon_options: icon_options
    when "entry"
      ma_icon "receipt", icon_options: icon_options
    when "statement"
      ma_icon "call_to_action", icon_options: icon_options
    when "bank_account"
      ma_icon "monetization_on", icon_options: icon_options
    when "account_transfer"
      ma_icon "compare_arrows", icon_options: icon_options
    when "deposit"
      ma_icon "assignment_returned", icon_options: icon_options
    when "check"
      ma_icon "offline_pin", icon_options: icon_options
    when "payment"
      ma_icon "local_atm", icon_options: icon_options
    when "invoice"
      ma_icon "featured_play_list", icon_options: icon_options
    when "purchase_order"
      ma_icon "featured_video", icon_options: icon_options
    when "customer"
      ma_icon "shopping_basket", icon_options: icon_options
    when "credit_card"
      ma_icon "credit_card", icon_options: icon_options
    when "credit_card_charge"
      ma_icon "credit_card", icon_options: icon_options
    when "charge"
      ma_icon "credit_card", icon_options: icon_options
    when "credit_card_payment"
      ma_icon "local_atm", icon_options: icon_options
    when "report"
      ma_icon "assignment", icon_options: icon_options
    when "ap_aging_report"
      ma_icon "assignment", icon_options: icon_options
    when "ar_aging_report"
      ma_icon "assignment", icon_options: icon_options
    when "batch_upload"
      ma_icon "create_new_folder", icon_options: icon_options
    when "credit"
      ma_icon "attach_money", icon_options: icon_options
    when "debit"
      ma_icon "monetization_on", icon_options: icon_options
    when "address"
      ma_icon "domain", icon_options: icon_options
    when "department"
      ma_icon "work", icon_options: icon_options
    else
      ma_icon class_name, icon_options: icon_options
    end
  end

  def fs_link(url="")
    app_secret = ::Rails.application.config.filestack_rails.app_secret
    security = FilestackSecurity.new(app_secret, options: {"call" => %w[read], "expiry" => 3600})
    security.sign_url("#{url}?")
  end

  def fs_avatar_link(url="", options={h: 35, w: 35, f: :crop})
    file_handle = url.split("/").last
    app_secret = ::Rails.application.config.filestack_rails.app_secret
    api_key = ::Rails.application.config.filestack_rails.api_key
    security = FilestackSecurity.new(app_secret, options: {"call" => %w[read convert], "expiry" => 3600})
    file = FilestackFilelink.new(file_handle, apikey: api_key, security: security)
    file.transform.resize(options).url
  end

  def state_color(state)
    case state.underscore.downcase
    when "draft"
      "#2196f3"
    when "needs_revision"
      "#ffb300"
    when "needs_approval"
      "#ffb300"
    when "needs_payment_approval"
      "#ffb300"
    when "paid"
      "#4caf50"
    when "approved"
      "#4caf50"
    when "ready_to_print"
      "#4caf50"
    when "reversal_proposed"
      "#ffb300"
    when "reversed"
      "#f44336"
    else
      "#2196f3"
    end
  end

  # get_policy_and_signature from Filstack Gem times out from the time that the server starts
  # This method will create permissions that will time out from the time the method is called
  def get_fresh_policy_and_signature
    app_secret = ::Rails.application.config.filestack_rails.app_secret
    security = FilestackSecurity.new(app_secret,
                                     options: {"call" => %w[pick read convert upload stat store exif],
                                               "expiry" => 3600})

    [security.signature, security.policy]
  end

  # Dashboard Helper Functions
  #-------------------------------------------------------------------------------
  # Note: Remove/Refactor when we remove Payment model
  def calculate_payments_for_current_month
    @current_org
      .payments
      .where(payable_type: "Vendor", date: DateTime.now.beginning_of_month..Date.today)
      .joins(:entry)
      .inject(0) {|total, payment| payment.entry.amount + total }
  end

  def payments_paid_for_current_month
    @current_org
      .payments
      .where(payable_type: "Vendor", date: DateTime.now.beginning_of_month..Date.today)
      .count
  end

  def unpaid_vendor_invoices_for_current_year
    @current_org
      .invoices
      .where(invoiceable_type: "Vendor")
      .where(due_date: 365.days.ago..Date.today)
      .where.not(aasm_state: :paid)
  end

  def unpaid_vendor_invoices_for_current_year_total
    unpaid_vendor_invoices_for_current_year.map(&:amount).inject(Money.new(0)) {|total, amount| amount + total }
  end

  def unbilled_invoices_for_current_year
    @current_org
      .invoices
      .where(invoiceable_type: "Vendor")
      .where(aasm_state: [:ready_to_pay, :needs_payment_approval, :payment_reviewed])
  end

  def unbilled_invoices_for_current_year_total
    unbilled_invoices_for_current_year.map(&:amount).inject(Money.new(0)) {|total, amount| amount + total }
  end

  def vendor_purchase_order_path(vendor, purchase_order)
    "/vendors/#{vendor.slug}/purchase_orders/#{purchase_order.slug}"
  end

  def new_vendor_purchase_order_path(vendor)
    "/vendors/#{vendor.slug}/purchase_orders/new"
  end

  def edit_vendor_purchase_order_path(vendor, purchase_order)
    "/vendors/#{vendor.slug}/purchase_orders/#{purchase_order.slug}/edit"
  end

  def edit_batch_upload_path(id)
    "/batch_uploads/#{id}"
  end

  def new_batch_upload_path
    "/batch_uploads/new"
  end

  def batch_upload_path
    "/batch_uploads"
  end
end
