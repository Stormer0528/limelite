import PropTypes from "prop-types";
import clsx from "clsx";

const PageHeader = ({
  page_name = "",
  icon_type = "",
  icon_options = {},
  tag_name = "h2",
  className,
  ...rest
}) => {
  const TagName = tag_name;
  return (
    <TagName className={clsx("page-header", className)} {...rest}>
      {class_icon(
        icon_type,
        Object.assign({}, {icon_options: "medium"}, icon_options)
      )}
      <span className="text"> {page_name}</span>
    </TagName>
  );
};

PageHeader.propTypes = {
  page_name: PropTypes.string,
  icon_type: PropTypes.string,
  icon_options: PropTypes.string,
  tag_name: PropTypes.string,
};

export const ma_icon = (icon_type, {icon_options}) => (
  <i className={`material-icons ${icon_options}`}>{icon_type}</i>
);

export const class_icon = (class_name, {icon_options = ""} = {}) => {
  switch (class_name) {
    case "vendor":
      return ma_icon("store", {icon_options});
    case "account":
      return ma_icon("chrome_reader_mode", {icon_options});
    case "fund":
      return ma_icon("attach_money", {icon_options});
    case "function":
      return ma_icon("functions", {icon_options});
    case "goal":
      return ma_icon("wifi_tethering", {icon_options});
    case "location":
      return ma_icon("location_on", {icon_options});
    case "object":
      return ma_icon("web_asset", {icon_options});
    case "resource":
      return ma_icon("vignette", {icon_options});
    case "year":
      return ma_icon("date_range", {icon_options});
    case "organization":
      return ma_icon("account_balance", {icon_options});
    case "user":
      return ma_icon("supervisor_account", {icon_options});
    case "entry":
      return ma_icon("receipt", {icon_options});
    case "bank_account":
      return ma_icon("monetization_on", {icon_options});
    case "account_transfer":
      return ma_icon("compare_arrows", {icon_options});
    case "deposit":
      return ma_icon("assignment_returned", {icon_options});
    case "check":
      return ma_icon("offline_pin", {icon_options});
    case "payment":
      return ma_icon("local_atm", {icon_options});
    case "invoice":
      return ma_icon("featured_play_list", {icon_options});
    case "purchase_order":
      return ma_icon("featured_video", {icon_options});
    case "customer":
      return ma_icon("perm_contact_calendar", {icon_options});
    case "credit_card":
      return ma_icon("credit_card", {icon_options});
    case "charge":
      return ma_icon("credit_card", {icon_options});
    case "credit_card_charge":
      return ma_icon("credit_card", {icon_options});
    case "credit_card_payment":
      return ma_icon("local_atm", {icon_options});
    case "report":
      return ma_icon("assignment", {icon_options});
    case "ap_aging_report":
      return ma_icon("assignment", {icon_options});
    case "statement":
      return ma_icon("call_to_action", {icon_options});
    case "credit":
      return ma_icon("attach_money", {icon_options});
    case "debit":
      return ma_icon("monetization_on", {icon_options});
    default:
      return ma_icon(class_name, {icon_options});
  }
};

export default PageHeader;
