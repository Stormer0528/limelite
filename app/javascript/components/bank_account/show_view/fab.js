import PropTypes from "prop-types";
import {useState} from "react";
import {withStyles} from "@material-ui/core/styles";
import SpeedDial from "@material-ui/lab/SpeedDial";
import SpeedDialAction from "@material-ui/lab/SpeedDialAction";

// Icons
import EditIcon from "@material-ui/icons/Edit";
import DepositIcon from "@material-ui/icons/AssignmentReturned";
import CheckIcon from "@material-ui/icons/OfflinePin";
import TransferIcon from "@material-ui/icons/CompareArrows";

const Fab = ({
  account_id,
  permissions: {
    canCreateCheck = false,
    canCreateDeposit = false,
    canCreateAccountTransfer = false,

    bank_account: {edit: canEdit = false},
  } = {},
  classes = {},
}) => {
  const [open, setOpenValue] = useState(false);
  if (
    ![canCreateCheck, canCreateDeposit, canCreateAccountTransfer, canEdit].some(
      val => val
    )
  ) {
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
      ariaLabel="Edit Bank Account"
      classes={{fab: classes.speedDialBtn}}
      className={classes.speedDial}
      hidden={false}
      direction="up"
      icon={<EditIcon />}
      onBlur={handleClose}
      onClick={handleClick(`/bank_accounts/${account_id}/edit`)}
      onClose={handleClose}
      onFocus={handleOpen}
      onMouseEnter={handleOpen}
      onMouseLeave={handleClose}
      open={open}
    >
      {canCreateAccountTransfer && (
        <SpeedDialAction
          key="transfer"
          icon={<TransferIcon />}
          tooltipTitle="+&nbsp;Transfer"
          tooltipOpen
          className={classes.transferBtn}
          classes={{
            staticTooltipLabel: classes.label,
          }}
          onClick={handleClick(
            `/bank_accounts/${account_id}/account_transfers/new`
          )}
        />
      )}
      {canCreateCheck && (
        <SpeedDialAction
          key="check"
          icon={<CheckIcon />}
          tooltipTitle="+&nbsp;Check"
          tooltipOpen
          className={classes.checkBtn}
          classes={{
            staticTooltipLabel: classes.label,
          }}
          onClick={handleClick(`/bank_accounts/${account_id}/checks/new`)}
        />
      )}
      {canCreateDeposit && (
        <SpeedDialAction
          key="deposit"
          icon={<DepositIcon />}
          tooltipTitle="+&nbsp;Deposit"
          tooltipOpen
          className={classes.depositBtn}
          classes={{
            staticTooltipLabel: classes.label,
          }}
          onClick={handleClick(`/bank_accounts/${account_id}/deposits/new`)}
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
  depositBtn: {
    backgroundColor: "#2196f3",
    color: "#fff",

    "&:hover": {
      backgroundColor: "#1565C0",
    },

    "&:focus": {
      outline: "none",
      boxShadow:
        "0px 3px 5px -1px #2196f32e, 0px 6px 10px 0px #2196F355, 0px 1px 18px 0px #2196f3cc",
      backgroundColor: "#2196F3",
    },
  },
  checkBtn: {
    backgroundColor: "#ff9800",
    color: "#fff",

    "&:hover": {
      backgroundColor: "#EF6C00",
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
      backgroundColor: "#c62828",
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
  },
  speedDial: {
    position: "fixed",
    right: "23px",
    bottom: "23px",
    zIndex: "997",
  },
});

export default withStyles(styles)(Fab);
