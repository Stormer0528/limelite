import PropTypes from "prop-types";
import {useState, useCallback} from "react";

import Tooltip from "@material-ui/core/Tooltip";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import Button from "@material-ui/core/Button";

import VendorIcon from "@material-ui/icons/Store";
import CustomerIcon from "@material-ui/icons/PermContactCalendar";

import VendorDropdown from "../shared/vendor_selector_container";
import CustomerDropdown from "../shared/customer_selector_container";

import {withStyles} from "@material-ui/core/styles";

const VendorCustomerInput = ({
  payableType = "Vendor",
  payableName = "Add Vendor/Customer",
  payableId,
  disabled,
  readOnly,
  onChange = function () {},
  handleVendorChange = function () {},
  classes = {},
  ...rest
}) => {
  // Modal Toggle State
  //----------------------------------------------------------------------------
  const [open, setOpen] = useState(false);

  const handleClickOpen = useCallback(() => {
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  // Payable Name State
  //----------------------------------------------------------------------------
  const [payName, setpayableName] = useState(payableName);

  // Payable Toggle State
  //----------------------------------------------------------------------------
  const [payable, setPayableType] = useState(payableType);
  const togglePayableType = (val) => () => {
    const str = val === "Vendor" ? "Customer" : "Vendor";
    setPayableType(str);
  };
  const PayableIcon = payable === "Vendor" ? VendorIcon : CustomerIcon;
  const handleDropdownChange = useCallback(
    ({target: {value, selectedItem} = {}}) => {
      // Note: onChange passes name values as well as ids ... so we need to cature only ids before closing
      if (parseInt(value)) {
        handleClose();
        selectedItem && setpayableName(selectedItem.displayName);
        handleChange({id: value, payableType: payable, payableName: payName});
      }
    }
  );

  return (
    <div {...rest} className={classes.root}>
      <Button
        color="primary"
        onClick={handleClickOpen}
        readOnly={readOnly}
        disabled={disabled}
        tooltip={payable}
        classes={{
          disabled: classes.btnDisabled,
        }}
      >
        {payName !== "Add Vendor/Customer" && (
          <PayableIcon className={classes.buttonIcon} />
        )}
        {payName || "Add Vendor/Customer"}
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="lg"
        fullWidth
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          <Tooltip title={`Toggle ${payable}`} placement="top">
            <Button
              onClick={togglePayableType(payable)}
              aria-label="Toggle Button"
              className={classes.button}
            >
              <PayableIcon className={classes.buttonIcon} />
              {`Choose ${payable || payableType}`}
            </Button>
          </Tooltip>
        </DialogTitle>
        <DialogContent className={classes.container}>
          <div className={classes.dropdown}>
            {payable === "Vendor" && (
              <VendorDropdown
                autoWidth
                value={payableId}
                handleVendorChange={handleDropdownChange}
                paperStyles={{
                  width: "50vw",
                }}
              />
            )}
            {payable === "Customer" && (
              <CustomerDropdown
                autoWidth
                value={payableId}
                handleCustomerChange={handleDropdownChange}
                paperStyles={{
                  width: "50vw",
                }}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

VendorCustomerInput.propTypes = {
  payableName: PropTypes.string,
  payableType: PropTypes.string,
  payableId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  onChange: PropTypes.func,
  classes: PropTypes.object.isRequired,
};

export const styles = (theme) => ({
  root: {
    display: "flex",
    minWidth: "15em",
    alignItems: "flex-end",
    paddingRight: "5px",
  },
  dropdown: {
    position: "relative",
    top: "-3px",
  },
  buttonIcon: {},
  container: {
    minHeight: "50vw",
  },
  btnDisabled: {
    color: "#607D8B !important",
    border: "1px solid #CFD8DC",
    backgroundColor: "#ECEFF1",
  },
});

export default withStyles(styles)(VendorCustomerInput);
