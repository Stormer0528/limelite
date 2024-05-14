import {Fragment} from "react";
import PropTypes from "prop-types";
import {makeStyles} from "@material-ui/core/styles";
import {titleize} from "@utils";

import StateIcon from "@shared/state_icon";
import ApprovalHistoryModal from "@shared/approval_history_modal";
import AuthProgress from "@shared/auth_footer/auth_progress";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";

import SaveAltIcon from "@material-ui/icons/SaveAlt";

export default function SubmissionBar({
  aasmState = "draft",
  handleSubmit,
  stateChangeLogs = [],
  approvedAt,
  approver,
  authorizations = [],
  authorizationPath = [],
  authorizationPathIndex = 0,
}) {
  const classes = useStyles();

  return (
    <AppBar position="fixed" component="footer" className={classes.root}>
      <Toolbar className={classes.toolbar}>
        <div className={classes.stateCell}>
          <h5 className={`currentState ${aasmState}`}>
            <b>Status:</b>
            <StateIcon aasmState={aasmState} />
            <span className="status">&nbsp;{titleize(aasmState)}</span>
          </h5>
        </div>
        <div className={classes.center}>
          <AuthProgress
            authorizations={authorizations}
            authorizationPath={authorizationPath}
            authorizationPathIndex={authorizationPathIndex}
          />

          {aasmState === "approved" && (
            <div className={classes.approvalText}>
              <b>Posted:&nbsp;</b>
              <span> {approvedAt} </span>
              &nbsp;
              {approver && (
                <Fragment>
                  <b>By:&nbsp;</b>
                  <span>{approver}</span>
                </Fragment>
              )}
            </div>
          )}
        </div>
        <div className={classes.right}>
          <Button
            variant="outlined"
            startIcon={<SaveAltIcon />}
            onClick={handleSubmit}
          >
            Submit Upload
          </Button>
        </div>
        <ApprovalHistoryModal {...{stateChangeLogs}} />
      </Toolbar>
    </AppBar>
  );
}

SubmissionBar.propTypes = {
  aasmState: PropTypes.string,
  handleSubmit: PropTypes.func.isRequired,
  approvedAt: PropTypes.string,
  approver: PropTypes.string,
  stateChangeLogs: PropTypes.arrayOf(
    PropTypes.shape({
      fromState: PropTypes.string,
      toState: PropTypes.string,
    })
  ),
  authorizationPathIndex: PropTypes.number,
  authorizations: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string,
      userName: PropTypes.string,
      action: PropTypes.string,
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    })
  ),
  authorizationPath: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      idid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    })
  ),
};

const useStyles = makeStyles((theme) => ({
  root: {
    position: "fixed",
    top: "auto",
    left: 0,
    bottom: 0,
    zIndex: 99,
    background: "linear-gradient(to bottom, #f5f5f5, #f0f0f0)",
    borderTop: "1px solid #e0e0e0",
    padding: "0 .5em",
    display: "grid",
    alignItems: "center",
    width: "100%",
  },
  toolbar: {
    display: "grid",
    gridColumnGap: theme.spacing(),
    gridTemplateColumns:
      "minmax(5rem, max-content) 1fr minmax(5rem, max-content) 50px",
    justifyContent: "flex-start",
    margin: "auto 0",
  },
  stateCell: {
    "& h5.currentState": {
      margin: 0,
      fontSize: "16px",
      position: "relative",
      top: "0.125em",
      color: ({aasmState}) => theme.states[aasmState],
      display: "flex",
      justifyContent: "flex-start",
      paddingLeft: 8,
      alignItems: "center",

      "&.draft": {
        color: "#2196f3",
      },
      "&.approved": {
        color: "#4caf50",
      },
      "&.needs_revision, &.needs_approval": {
        color: "#ffb300",
      },

      "&.reversed": {
        color: "#f44336",
      },
      "& > b": {
        display: "inline-block",
        marginRight: ".5rem",
        color: theme.palette.text.primary,
      },
    },
  },
  left: {
    display: "contents",

    "& h5.currentState": {
      margin: 0,
      fontSize: "16px",
      position: "relative",
      top: "0.125em",
      color: ({aasmState}) => theme.states[aasmState],
      display: "flex",
      justifyContent: "flex-start",
      paddingLeft: 8,
      alignItems: "center",

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
      "& > b": {
        color: "black",
        display: "inline-block",
        marginRight: ".5rem",
      },
    },
  },
  center: {
    flexGrow: 1,
    textAlign: "center",
    padding: "0 .5em",
  },
  right: {},
}));
