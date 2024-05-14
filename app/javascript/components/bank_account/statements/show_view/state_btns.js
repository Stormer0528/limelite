import PropTypes from "prop-types";
import {Fragment} from "react";
import Button from "@material-ui/core/Button";
import {makeStyles} from "@material-ui/styles";

import ApproveIcon from "@shared/icons/state_actions/approve";
import DenyIcon from "@shared/icons/state_actions/deny";
import ReverseApprovalIcon from "@shared/icons/state_actions/reverse_approval";
import SaveDraftIcon from "@shared/icons/state_actions/save_draft";
import SendForApprovalIcon from "@shared/icons/state_actions/send_for_approval";

const StateBtns = ({
  aasm_state = "draft",
  permissions = {},
  valid = true,
  variant = "outlined",
  submitHandler = function () {},
}) => {
  const classes = useStyles();
  return (
    <Fragment>
      {["draft", "needs_revision"].includes(aasm_state) &&
        permissions.save_draft && (
          <Button
            color="primary"
            disabled={!valid}
            onClick={submitHandler("save_draft")}
            variant={variant}
            startIcon={<SaveDraftIcon />}
          >
            Save&nbsp;Draft
          </Button>
        )}
      {["needs_approval"].includes(aasm_state) && permissions.approve && (
        <Button
          color="primary"
          variant={variant}
          onClick={submitHandler("approve")}
          disabled={!valid}
          style={{
            backgroundColor: "#DCEDC8",
            color: "green",
          }}
          endIcon={<ApproveIcon />}
        >
          Approve
        </Button>
      )}
      {aasm_state === "needs_approval" && !permissions.approve && (
        <b className={classes.needsApprovalText}>Awaiting Approval</b>
      )}
      <div style={{height: ".5rem"}}>&nbsp;</div>
      {["draft", "needs_revision"].includes(aasm_state) &&
        permissions.send_for_approval && (
          <Button
            style={{
              color: "#F9A825",
              borderColor: "#F9A825",
            }}
            variant={variant}
            onClick={submitHandler("send_for_approval")}
            disabled={!valid}
            startIcon={<SendForApprovalIcon />}
          >
            &nbsp;Send&nbsp;for&nbsp;Approval&nbsp;
          </Button>
        )}
      {["needs_approval"].includes(aasm_state) && permissions.deny && (
        <Button
          color="secondary"
          variant={variant}
          onClick={submitHandler("deny")}
          disabled={!valid}
          style={{
            color: "#B71C1C",
            backgroundColor: "#EF9A9A",
          }}
          startIcon={<DenyIcon />}
        >
          Deny
        </Button>
      )}
      {aasm_state === "approved" && permissions.reverse_approval && (
        <Button
          color="secondary"
          variant={variant}
          onClick={submitHandler("reverse_approval")}
          disabled={!valid}
          style={{
            color: "#F4511E",
            borderColor: "#FFB74D",
          }}
          startIcon={<ReverseApprovalIcon />}
        >
          Reverse&nbsp;Approval
        </Button>
      )}
    </Fragment>
  );
};

StateBtns.propTypes = {
  aasm_state: PropTypes.string,
  /* variant of the buttons displayed */
  variant: PropTypes.string,
  permissions: PropTypes.shape({
    create: PropTypes.bool,
    edit: PropTypes.bool,
    view: PropTypes.bool,
    show: PropTypes.bool,
    update: PropTypes.bool,
    delete: PropTypes.bool,
    save_draft: PropTypes.bool,
    send_for_approval: PropTypes.bool,
    approve: PropTypes.bool,
    deny: PropTypes.bool,
  }),
  /* whether the form is valid and should be submitted */
  valid: PropTypes.bool,
  submitHandler: PropTypes.func.isRequired,
};

const useStyles = makeStyles((theme) => ({
  needsApprovalText: {
    padding: ".75rem",
    borderRadius: 5,
    color: "#b38c05",
    background: "#f1e8cb",
  },
}));

export default StateBtns;
