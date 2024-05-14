class IconHelper
  ICON_MAP = {
    account_transfer: "compare_arrows",
    account: "chrome_reader_mode",
    address: "domain",
    admin: "lock_outline",
    bank_account: "monetization_on",
    batch_upload: "create_new_folder",
    charge: "credit_card",
    check: "offline_pin",
    credit_card_charge: "credit_card",
    credit_card_payment: "local_atm",
    credit_card: "credit_card",
    credit: "attach_money",
    customer: "shopping_basket",
    debit: "monetization_on",
    deposit: "assignment_returned",
    entry: "receipt",
    function: "functions",
    fund: "attach_money",
    goal: "wifi_tethering",
    invoice: "ballot_outlined",
    location: "location_on",
    object: "web_asset",
    organization: "account_balance",
    payment: "local_atm",
    purchase_order: "ballot",
    report: "assignment",
    resource: "vignette",
    statement: "call_to_action",
    user: "supervisor_account",
    user_group: "group_work",
    vendor: "store",
    year: "date_range",
    unknown: "help_outline"
  }.freeze

  def icon(icon_type)
    "<i class='fa #{icon_type}'></i>".html_safe
  end

  def ma_icon(icon_type, icon_options: "")
    "<i class='material-icons #{icon_options}'>#{icon_type}</i>".html_safe
  end

  def self.get_icon(class_name)
    icon_name = class_name.to_s.underscore.singularize.to_sym

    ICON_MAP[icon_name] || ICON_MAP[:unknown]
  end
end
