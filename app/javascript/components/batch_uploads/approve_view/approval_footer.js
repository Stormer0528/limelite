import {Fragment} from "react";
import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core/styles";
import {titleCase} from "humanize-plus";

import StateIcon from "@shared/state_icon";
import ApprovalHistoryModal from "@shared/approval_history_modal";
import AuthProgress from "@shared/auth_footer/auth_progress";

import clsx from "clsx";

const ApprovalFooter = ({
  aasmState = "draft",
  stateChangeLogs = [],
  approvedAt,
  approver,
  className,
  authorizations = [],
  authorizationPath = [],
  authorizationPathIndex = 0,
  classes = {},
}) => {
  return (
    <div className={clsx([classes.root, className])}>
      <div className={classes.left}>
        <h5 className={`currentState ${aasmState}`}>
          <b>Status:</b>
          <StateIcon aasmState={aasmState} />
          <span className="status">&nbsp;{formatState(aasmState)}</span>
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
      <ApprovalHistoryModal {...{stateChangeLogs}} />
    </div>
  );
};

ApprovalFooter.propTypes = {
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  modelType: PropTypes.string,
  aasmState: PropTypes.string,
  hideStateBtns: PropTypes.bool,
  approvedAt: PropTypes.string,
  approver: PropTypes.string,
  className: PropTypes.string,
  permissions: PropTypes.object,
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
  classes: PropTypes.object.isRequired,
};

const styles = (theme) => ({
  root: {
    background: "linear-gradient(to bottom, #f5f5f5, #f0f0f0)",
    borderTop: "1px solid #e0e0e0",
    padding: "0 .5em",
    display: "grid",
    gridTemplateColumns: "minmax(0px, max-content) 1fr 50px",
    alignItems: "center",
    position: "fixed",
    bottom: 0,
    width: "100%",
    left: 0,
    zIndex: 10,
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
  approvalText: {
    color: "#4baf4f",
    fontWeight: "400",

    "& > b": {
      color: "#43A047",
    },
  },
});

export default withStyles(styles)(ApprovalFooter);

// HELPER FUNCTIONS
//------------------------------------------------------------------------------

function formatState(state) {
  return titleCase(state.replace(/_/, " "));
}
