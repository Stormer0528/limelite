import {useCallback, useState} from "react";
import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core/styles";
import {titleize} from "../../../../utils";
import clsx from "clsx";

// Material UI
import AppBar from "@material-ui/core/AppBar";
import IconButton from "@material-ui/core/IconButton";
import Drawer from "@material-ui/core/Drawer";

import HistoryIcon from "@material-ui/icons/History";

import StateIcon from "@shared/state_icon";
import StateBtns from "./state_btns";
import VersionsSidebar from "./versions_sidebar";

// Component
//------------------------------------------------------------------------------
const ApprovalFooter = ({
  remainingBalance = "n/a",
  statement_balance = "$0.00",
  statement_id,
  aasm_state = "draft",
  bank_account_id,
  valid = false,
  classes = {},
  permissions = {},
  audits = [],
  createSubmitHandler = function () {},
  handletoggleConfirmationModal = function () {},
}) => {
  const [versionsDrawerOpen, setVersionsDrawerOpen] = useState(false);
  const handleOpenVersionsClick = useCallback(
    () => setVersionsDrawerOpen(true),
    [setVersionsDrawerOpen]
  );
  const handleCloseVersionsClick = useCallback(
    () => setVersionsDrawerOpen(false),
    [setVersionsDrawerOpen]
  );
  const submitHandler = useCallback(
    (state_action) => {
      return remainingBalance === "$0.00"
        ? createSubmitHandler({
            statement_id,
            bank_account_id,
            statement_balance,
            state_action,
          })
        : () => handletoggleConfirmationModal(state_action);
    },
    [
      handletoggleConfirmationModal,
      createSubmitHandler,
      bank_account_id,
      remainingBalance,
      statement_balance,
      statement_id,
    ]
  );

  return (
    <AppBar
      color="inherit"
      position="sticky"
      component="footer"
      className={classes.appBar}
    >
      <section className={clsx(classes.status, aasm_state)}>
        <b>Status: </b>
        <StateIcon aasmState={aasm_state} />
        <span className={classes[aasm_state]}>{titleize(aasm_state)}</span>
      </section>
      <div className={classes.stateBtns}>
        <StateBtns
          {...{
            aasm_state,
            valid,
            submitHandler,
            permissions,
          }}
        />
      </div>
      <div className={classes.historyBtn}>
        {statement_id && (
          <IconButton
            variant="outlined"
            className={classes.historyBtnBtn}
            onClick={handleOpenVersionsClick}
          >
            <HistoryIcon />
          </IconButton>
        )}
      </div>
      {statement_id && (
        <Drawer
          open={versionsDrawerOpen}
          onClose={handleCloseVersionsClick}
          anchor="bottom"
          classes={{paperAnchorBottom: classes.versionDrawer}}
        >
          <VersionsSidebar
            statement_id={statement_id}
            audits={audits}
            handleClose={handleCloseVersionsClick}
          />
        </Drawer>
      )}
    </AppBar>
  );
};

// PropTypes
//------------------------------------------------------------------------------
ApprovalFooter.propTypes = {
  aasm_state: PropTypes.string,
  bank_account_id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  permissions: PropTypes.object,
  remainingBalance: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  statement_balance: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  statement_id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  valid: PropTypes.bool,
  createSubmitHandler: PropTypes.func.isRequired,
  handletoggleConfirmationModal: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  audits: PropTypes.arrayOf(PropTypes.object),
};

// Theme
//------------------------------------------------------------------------------
const styles = (theme) => ({
  appBar: {
    background: "linear-gradient(to bottom right, #f5f5f5, #ECEFF1)",
    borderTop: "1px solid #bdbdbd",
    boxShadow: "0 0 7.5px rgba(33,33,33,.25)",
    color: "#607D8B",
    padding: "0.5rem 1em 0.5rem 0",
    position: "fixed",
    right: 0,
    top: "inherit",
    left: 0,
    bottom: 54,
    display: "grid",
    gridColumnGap: "0.65rem",
    gridTemplateColumns: "minmax(min-content, max-content) 1fr 64px",
    justifyContent: "center",
    alignItems: "center",
  },
  historyBtnBtn: {
    flexGrow: 1,

    "&:focus": {
      backgroundColor: "#33333317",
    },
  },
  status: {
    paddingLeft: "2.5rem",
    display: "flex",
    alignItems: "center",

    "& > b": {
      color: "#607D8B",
    },
    "& > svg": {
      marginLeft: "0.5em",
      marginRight: "0.125em",
    },

    "&.draft": {
      color: "#2196f3",
    },
    "&.approved": {
      color: "#4caf50",
    },
    "&.needs_revision": {
      color: "#ffb300",
    },

    "&.reversed": {
      color: "#f44336",
    },
  },
  historyBtn: {},
  stateBtns: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  versionDrawer: {
    minHeight: "50vh",
  },
  btnCell: {
    display: "flex",
    justifyContent: "space-around",

    "& button": {
      marginRight: "1rem",
    },
  },
});

// Export
//------------------------------------------------------------------------------
export default withStyles(styles)(ApprovalFooter);
