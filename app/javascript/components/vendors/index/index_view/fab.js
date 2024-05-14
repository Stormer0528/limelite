import PropTypes from "prop-types";
import {compose} from "redux";
import {withStyles} from "@material-ui/core/styles";
import {withHandlers, withStateHandlers} from "recompose";

import SpeedDial from "@material-ui/lab/SpeedDial";
import SpeedDialIcon from "@material-ui/lab/SpeedDialIcon";
import SpeedDialAction from "@material-ui/lab/SpeedDialAction";
import PayInvoicesIcon from "@material-ui/icons/Payment";
import VendorIcon from "@material-ui/icons/Store";
import AddIcon from "@material-ui/icons/Add";
import BatchUploadIcon from "@shared/icons/batch_upload_icon";

const Fab = ({
  hidden = false,
  open = true,
  handleClick = function() {},
  handleOpen = function() {},
  handleClose = function() {},
  permissions: {canCreateVendor = false} = {},
  classes = {},
}) => {
  let isTouch;
  if (typeof document !== "undefined") {
    isTouch = "ontouchstart" in document.documentElement;
  }

  if (!canCreateVendor) {
    return null;
  }

  return (
    <SpeedDial
      ariaLabel="Add Vendor"
      className={classes.speedDial}
      hidden={hidden}
      icon={<SpeedDialIcon openIcon={<AddIcon />} />}
      onBlur={handleClose}
      onClose={handleClose}
      onFocus={handleOpen}
      onMouseEnter={handleOpen}
      onMouseLeave={handleClose}
      open={open}
      direction="up"
    >
      <SpeedDialAction
        key={1}
        icon={<BatchUploadIcon />}
        tooltipTitle="+ Batch Upload"
        onClick={handleClick("/batch_uploads/new")}
      />
      <SpeedDialAction
        key={2}
        icon={<PayInvoicesIcon />}
        tooltipTitle="Pay Invoices"
        onClick={handleClick("/batch_payments")}
      />
      <SpeedDialAction
        key={3}
        icon={<VendorIcon />}
        tooltipTitle="+ Vendor"
        onClick={handleClick("/vendors/new")}
      />
    </SpeedDial>
  );
};

Fab.propTypes = {
  hidden: PropTypes.bool,
  open: PropTypes.bool,
  handleOpen: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleClick: PropTypes.func.isRequired,
  permissions: PropTypes.object,
  classes: PropTypes.object.isRequired,
};

const styles = theme => ({
  speedDial: {
    position: "fixed",
    right: "23px",
    bottom: "23px",
    paddingTop: "15px",
    marginBottom: "0",
    zIndex: "997",

    "&  > button": {
      backgroundColor: "#4CAF50",

      "& + div > button:first-child": {
        color: "white",
        backgroundColor: "#2196F3",
        marginTop: "1em",
      },
      "& + div > button:last-child": {
        color: "white",
        backgroundColor: "#FFEB3B",
      },
    },
  },
});

export default compose(
  withStyles(styles),
  withStateHandlers(
    ({initialOpen = false}) => ({
      open: initialOpen,
    }),
    {
      handleClose: () => () => {
        return {open: false};
      },
      handleOpen: () => () => {
        return {open: true};
      },
    }
  ),
  withHandlers({
    handleClick: _props => path => _e => {
      window.location = path;
    },
  })
)(Fab);
