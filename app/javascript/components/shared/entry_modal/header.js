import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core/styles";

// MUI
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import DialogTitle from "@material-ui/core/DialogTitle";
import Avatar from "@material-ui/core/Avatar";
import Fade from "@material-ui/core/Fade";

// Icons
import EntryIcon from "../icons/entry_icon";
import CustomerIcon from "../icons/customer_icon";
import VendorIcon from "../icons/vendor_icon";
import PaymentIcon from "../icons/payment_icon";
import InvoiceIcon from "../icons/invoice_icon";
import CheckIcon from "../icons/check_icon";
import DepositIcon from "../icons/deposit_icon";
import AccountTransferIcon from "../icons/account_transfer_icon";
import CreditCardChargeIcon from "../icons/credit_card_charge_icon";
import CreditCardPaymentIcon from "../icons/credit_card_payment_icon";

import OpenFileIcon from "@material-ui/icons/FindInPage";

const EntryModal = ({
  loading = false,
  entry: {
    path,
    payableType,
    payablePath,
    payableName,
    journalableType,
    journalablePath,
    bankAccountItems = [],
    creditCardItems = [],
  } = {},
  classes = {},
}) => {
  const PayableIcon = payableType === "Vendor" ? VendorIcon : CustomerIcon;
  const JournalableIcon =
    journalableType === "Payment" ? PaymentIcon : InvoiceIcon;

  return (
    <DialogTitle id="entry-dialog-title" className={classes.dialogTitle}>
      <Avatar>
        <EntryIcon />
      </Avatar>

      <div className={classes.entryTitle}>Entry</div>
      <Fade in={!loading}>
        <ButtonGroup variant="text" className={classes.buttons}>
          {/* Payable Btn */}
          {payablePath && (
            <Button
              className={classes.button}
              startIcon={<PayableIcon />}
              href={payablePath}
              target="_blank"
            >
              <b>{payableType}:&nbsp;</b>
              {payableName}
            </Button>
          )}
          {/* Bank Account Items */}
          {AccountLinks(bankAccountItems, classes)}

          {/* Credit Card Items */}
          {AccountLinks(creditCardItems, classes)}
          {/* Journalable Btn */}
          {journalablePath && (
            <Button
              className={classes.button}
              startIcon={<JournalableIcon />}
              href={journalablePath}
              target="_blank"
            >{`${journalableType}`}</Button>
          )}
          {/* Entry Btn */}
          <Button
            className={classes.button}
            startIcon={<OpenFileIcon />}
            href={path}
            target="_blank"
          >
            Entry
          </Button>
        </ButtonGroup>
      </Fade>
    </DialogTitle>
  );
};
EntryModal.propTypes = {
  open: PropTypes.bool,
  loading: PropTypes.bool,
  handleClose: PropTypes.object,
  entry: PropTypes.shape({
    path: PropTypes.string,
    payableType: PropTypes.string,
    payablePath: PropTypes.string,
    journalableType: PropTypes.string,
    journalablePath: PropTypes.string,
  }),
  classes: PropTypes.object.isRequired,
};

const styles = (theme) => ({
  dialogTitle: {
    "& h2": {
      display: "grid",
      gridTemplateColumns: "42px max-content 1fr",
      alignItems: "center",
      gridColumnGap: ".25em",
    },
  },
  buttons: {
    display: "flex",
    justifyContent: "flex-end",
  },
  button: {
    color: "#607D8B",
    opacity: ".85",
    marginLeft: "0.25rem",

    "&:hover": {
      // background: "transparent",
      opacity: 1,
      willChange: "opacity",
      transition: "opacity .15s linear",
    },
  },
});

export default withStyles(styles)(EntryModal);

// Helpers
//---------------------------------------------------------------------------

const AccountLinks = (items, classes = {}) => {
  return items.map((item) => {
    const Icon =
      item.type === "Check"
        ? CheckIcon
        : item.type === "Deposit"
        ? DepositIcon
        : item.type === "AccountTransfer"
        ? AccountTransferIcon
        : item.type === "Charge"
        ? CreditCardChargeIcon
        : CreditCardPaymentIcon;

    const number = item.number === "DEPOSIT" ? "" : `#${item.number}`;
    return (
      <Button
        startIcon={<Icon />}
        href={item.path}
        target="_blank"
        className={classes.button}
      >
        <b>{item.type}:&nbsp;</b>
        {number}
      </Button>
    );
  });
};
