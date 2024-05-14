import PropTypes from "prop-types";
import {useState} from "react";
import {withStyles} from "@material-ui/core/styles";
import SpeedDial from "@material-ui/lab/SpeedDial";
import SpeedDialAction from "@material-ui/lab/SpeedDialAction";

// Icons
import EditIcon from "@material-ui/icons/Edit";
import InvoiceIcon from "@material-ui/icons/List";

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
      ariaLabel="Edit Customer"
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
      onClick={handleClick(`/customers/${account_id}/edit`)}
    >
      {canCreateInvoice && (
        <SpeedDialAction
          key="invoice"
          icon={<InvoiceIcon />}
          tooltipTitle="+&nbsp;Invoice"
          tooltipOpen
          className={classes.invoiceBtn}
          classes={{
            staticTooltipLabel: classes.label,
          }}
          onClick={handleClick(`/customers/${account_id}/invoices/new`)}
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
  invoiceBtn: {
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
