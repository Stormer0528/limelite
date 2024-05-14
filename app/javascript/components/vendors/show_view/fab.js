import PropTypes from "prop-types";
import {useState} from "react";
import {withStyles} from "@material-ui/core/styles";
import SpeedDial from "@material-ui/lab/SpeedDial";
import SpeedDialAction from "@material-ui/lab/SpeedDialAction";

// Icons
import EditIcon from "@material-ui/icons/Edit";
import InvoiceIcon from "@material-ui/icons/List";
import PurchaseOrderIcon from "@material-ui/icons/Assignment";

const Fab = ({
  account_id,
  permissions: {
    edit: canEdit = true,
    canCreateInvoice = canEdit,
    canCreatePurchaseOrder = canEdit,
  } = {},

  classes = {},
}) => {
  const [open, setOpenValue] = useState(false);
  if (![canCreateInvoice, canCreatePurchaseOrder, canEdit].some(val => val)) {
    return null;
  }

  const handleClose = () => {
    setOpenValue(false);
  };

  const handleClick = path => e => {
    e.stopPropagation();
    window.location = path;
  };

  const handleOpen = () => {
    setOpenValue(true);
  };

  return (
    <SpeedDial
      ariaLabel="Edit Vendor"
      classes={{fab: classes.speedDialBtn}}
      className={classes.speedDial}
      hidden={false}
      icon={<EditIcon />}
      onBlur={handleClose}
      onClose={handleClose}
      onFocus={handleOpen}
      onMouseEnter={handleOpen}
      onMouseLeave={handleClose}
      open={open}
      onClick={handleClick(`/vendors/${account_id}/edit`)}
    >
      {canCreateInvoice && (
        <SpeedDialAction
          key="invoice"
          icon={<InvoiceIcon />}
          tooltipTitle="+&nbsp;Invoice"
          tooltipOpen
          className={classes.transferBtn}
          classes={{
            staticTooltipLabel: classes.label,
          }}
          onClick={handleClick(`/vendors/${account_id}/invoices/new`)}
        />
      )}
      {canCreatePurchaseOrder && (
        <SpeedDialAction
          key="purchase_order"
          icon={<PurchaseOrderIcon />}
          tooltipTitle="+&nbsp;Purchase&nbsp;Order"
          tooltipOpen
          className={classes.checkBtn}
          classes={{
            staticTooltipLabel: classes.label,
          }}
          onClick={handleClick(`/vendors/${account_id}/purchase_orders/new`)}
        />
      )}
    </SpeedDial>
  );
};

Fab.propTypes = {
  account_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  permissions: PropTypes.shape({
    edit: PropTypes.bool,
  }),
  classes: PropTypes.object.isRequired,
};

const styles = theme => ({
  speedDialBtn: {
    backgroundColor: "#4CAF50",

    "&:hover": {
      backgroundColor: "#43A047",
    },
  },
  checkBtn: {
    backgroundColor: "#ff9800",
    color: "#fff",

    "&:hover": {
      backgroundColor: "#F57C00",
    },

    "&:focus": {
      outline: "none",
      boxShadow:
        "0px 3px 5px -1px #EF6C002e, 0px 6px 10px 0px #EF6C0055, 0px 1px 18px 0px #EF6C00cc",
      backgroundColor: "#FB8C00",
    },
  },
  transferBtn: {
    backgroundColor: "#f44336",
    color: "#fff",

    "&:hover": {
      backgroundColor: "#D32F2F",
    },
    "&:focus": {
      outline: "none",
      boxShadow:
        "0px 3px 5px -1px #c628282e, 0px 6px 10px 0px #c6282855, 0px 1px 18px 0px #c62828cc",
      backgroundColor: "#f44336",
    },
  },

  label: {
    color: "#f5f5f5",
    backgroundColor: "#333",
    fontSize: "0.85rem",
    display: "flex",
    flexWrap: "nowrap",
  },

  speedDial: {
    position: "fixed",
    right: "23px",
    bottom: "23px",
    zIndex: "997",
  },
});

export default withStyles(styles)(Fab);
