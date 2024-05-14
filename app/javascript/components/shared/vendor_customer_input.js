import PropTypes from "prop-types";
import {memo, useState, useCallback, useEffect} from "react";
import clsx from "clsx";
import isNull from "lodash/isNull";

import Tooltip from "@material-ui/core/Tooltip";
import Button from "@material-ui/core/Button";

import VendorIcon from "@material-ui/icons/Store";
import CustomerIcon from "@material-ui/icons/PermContactCalendar";

import VendorDropdown from "../shared/vendor_selector_container";
import CustomerDropdown from "../shared/customer_selector_container";

import {withStyles} from "@material-ui/core/styles";

const VendorCustomerInput = memo(
  ({
    basename = "",
    classes = {},
    current = false,
    disabled = false,
    readOnly = false,
    id = "payableId",
    payableId,
    payableIdName = "payableId",
    payableNameName = "payableType",
    payableType = "Vendor",
    /* Hanndlers */
    handleBlur = function () {},
    handleChange = function () {},
  }) => {
    // Payable Name State
    //----------------------------------------------------------------------------
    const [payableName, setPayableType] = useState(payableType);
    useEffect(() => {
      if (payableName !== payableType) {
        setPayableType(payableType);
      }
    }, [payableName, payableType, setPayableType]);

    const togglePayableType = useCallback(() => {
      const updatedPayableName =
        payableName === "Vendor" ? "Customer" : "Vendor";
      setPayableType(updatedPayableName);
      const name = [basename, payableIdName].filter(Boolean).join(".");
      const typeName = [basename, payableNameName].filter(Boolean).join(".");
      handleChange({
        target: {
          values: {
            [name]: null,
            [typeName]: updatedPayableName,
          },
        },
      });
    }, [setPayableType, basename, payableName, payableNameName, handleChange]);

    const Icon = payableName === "Vendor" ? VendorIcon : CustomerIcon;
    const Dropdown =
      payableName === "Vendor" ? VendorDropdown : CustomerDropdown;
    const AlternatePayable = payableName === "Vendor" ? "Customer" : "Vendor";

    const handleDropdownChange = useCallback(
      (e, payable) => {
        const name = [basename, payableIdName].filter(Boolean).join(".");
        const typeName = [basename, payableNameName].filter(Boolean).join(".");
        // Set everything null if null
        if (isNull(payable)) {
          handleChange({
            target: {
              values: {
                [name]: null,
                [typeName]: null,
              },
            },
          });
        } else {
          // Otherwise set both name and id
          const {id: value = ""} = payable || {};
          handleChange({
            target: {
              values: {
                /* payableId */
                [name]: value,
                /* payableName */
                [typeName]: payableName,
              },
            },
          });
        }
      },
      [payableIdName, basename, payableName, payableNameName, handleChange]
    );

    return (
      <div className={classes.root}>
        <Tooltip
          title={`Toggle ${AlternatePayable}`}
          placement="top"
          disableHoverListener={disabled}
        >
          <span>
            <Button
              onClick={togglePayableType}
              className={clsx(
                classes.button,
                !disabled && current && classes.currentButton
              )}
              {...{readOnly, disabled}}
            >
              <Icon className={classes.buttonIcon} />
            </Button>
          </span>
        </Tooltip>
        <Dropdown
          {...{name, id, value: payableId, disabled, readOnly}}
          onChange={handleDropdownChange}
          onBlur={handleBlur}
        />
      </div>
    );
  }
);

VendorCustomerInput.propTypes = {
  payableName: PropTypes.string,
  payableType: PropTypes.string,
  basename: PropTypes.string,
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  payableIdName: PropTypes.string,
  payableNameName: PropTypes.string,
  handleBlur: PropTypes.func,
  handleChange: PropTypes.func,
  payableId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  current: PropTypes.bool,
  onChange: PropTypes.func,
  classes: PropTypes.object.isRequired,
};

export const styles = (theme) => ({
  root: {
    display: "grid",
    minWidth: "15em",
    // paddingRight: 5,
    gridTemplateColumns: "45px 1fr",
    alignItems: "flex-end",
  },
  dropdown: {
    position: "relative",
    top: "-3px",
  },
  button: {
    height: "32px",
    minWidth: "32px",
    marginRight: "8px",

    "& svg": {
      color: "#9E9E9E",
    },
  },

  currentButton: {
    background: "#dcf2fb",

    "&:hover": {
      backgroundColor: "#b3e5fc70",
    },

    "&:focus": {
      backgroundColor: "#4fc3f79c",
      borderColor: "#039BE5",
    },

    "&:focus svg": {
      color: "#1565c0",
    },

    "& svg": {
      color: "#55c0f1",
    },
  },
  buttonIcon: {},
  btnDisabled: {
    color: "#607D8B !important",
    border: "1px solid #CFD8DC",
    backgroundColor: "#ECEFF1",
  },
});

export default withStyles(styles)(VendorCustomerInput);
