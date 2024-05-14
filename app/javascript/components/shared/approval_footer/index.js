import {Fragment} from "react";
import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core/styles";
import {titleCase} from "humanize-plus";

import StateBtns from "./state_btn";
import StateIcon from "../state_icon";
import ApprovalHistoryModal from "../approval_history_modal";

import clsx from "clsx";

const ApprovalFooter = ({
  id,
  modelType,
  aasmState = "draft",
  stateChangeLogs = [],
  approvedAt,
  approver,
  permissions = {},
  className,
  hideStateBtns = false,
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
        {!hideStateBtns && (
          <StateBtns
            {...{
              id,
              modelType,
              permissions,
              aasmState,
              hideDraft: true,
            }}
          />
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
  classes: PropTypes.object.isRequired,
};

const styles = (theme) => ({
  root: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0px, auto)) 50px",
    borderTop: "1px solid #eee",
    width: "calc(100% + 1.15em)",
    padding: "0 .5em",
    alignItems: "center",
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
  },
  right: {
    paddingRight: ".5em",
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
