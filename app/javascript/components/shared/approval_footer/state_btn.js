import PropTypes from "prop-types";
import {useState, useCallback} from "react";
import {useMutation} from "react-apollo";
import {withStyles} from "@material-ui/core/styles";

import Button from "@material-ui/core/Button";

import ApproveIcon from "../icons/state_actions/approve";
import DenyIcon from "../icons/state_actions/deny";
import ReverseApprovalIcon from "../icons/state_actions/reverse_approval";
import SaveDraftIcon from "../icons/state_actions/save_draft";
import SendForApprovalIcon from "../icons/state_actions/send_for_approval";

import DenialModal from "./denial_modal";
import UPDATE_STATE_MUTATION from "../../../graphql/mutations/update_state.gql";

const StateBtns = ({
  id,
  modelType,
  aasmState = "draft",
  permissions = {},
  valid = true,
  hideDraft = false,
  classes = {},
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const handleModalClose = useCallback(() => {
    setModalOpen(false);
  }, [setModalOpen]);

  const handleModalOpen = useCallback(() => {
    setModalOpen(true);
  }, [setModalOpen]);

  const [updateItemState] = useMutation(UPDATE_STATE_MUTATION, {
    variables: {id, modelType},
    onCompleted: () => {
      window.location.reload();
    },
  });

  const handleDenial = useCallback(
    ({reason, nextState}) => {
      updateItemState({
        variables: {
          nextState,
          reason,
        },
      });
      setModalOpen(false);
    },
    [setModalOpen, updateItemState]
  );

  const submitHandler = useCallback(
    (nextState) => (e) => {
      e.preventDefault();
      updateItemState({
        variables: {
          nextState,
        },
      });
    },
    [updateItemState]
  );

  return (
    <div className={classes.root}>
      {["approved", "needs_approval"].includes(aasmState) && (
        <DenialModal
          nextState={
            aasmState === "needs_approval" ? "deny" : "reverse_approval"
          }
          open={modalOpen}
          handleClose={handleModalClose}
          handleSave={handleDenial}
        />
      )}
      {!hideDraft &&
        ["draft", "needs_revision"].includes(aasmState) &&
        permissions.save_draft && (
          <Button
            startIcon={<SaveDraftIcon />}
            variant="outlined"
            fullWidth
            onClick={submitHandler("save_draft")}
            disabled={!valid}
            className={classes.draftBtn}
          >
            Save Draft
          </Button>
        )}
      {["needs_approval"].includes(aasmState) && permissions.approve && (
        <Button
          variant="outlined"
          fullWidth
          onClick={submitHandler("approve")}
          disabled={!valid}
          className={classes.approveBtn}
          endIcon={<ApproveIcon />}
        >
          Approve
        </Button>
      )}
      <div style={{height: ".5rem"}}>&nbsp;</div>
      {["draft", "needs_revision"].includes(aasmState) &&
        permissions.send_for_approval && (
          <Button
            variant="outlined"
            fullWidth
            onClick={submitHandler("send_for_approval")}
            disabled={!valid}
            className={classes.sendForApprovalBtn}
            startIcon={<SendForApprovalIcon />}
          >
            Send for Approval
          </Button>
        )}
      {["needs_approval"].includes(aasmState) && permissions.deny && (
        <Button
          variant="outlined"
          fullWidth
          onClick={handleModalOpen}
          disabled={!valid}
          className={classes.denyBtn}
          startIcon={<DenyIcon />}
        >
          Deny
        </Button>
      )}
      {aasmState === "approved" && permissions.reverse_approval && (
        <Button
          variant="outlined"
          fullWidth
          onClick={handleModalOpen}
          disabled={!valid}
          className={classes.reverseApprovalBtn}
          startIcon={<ReverseApprovalIcon />}
        >
          Reverse Approval
        </Button>
      )}
    </div>
  );
};

StateBtns.propTypes = {
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  modelType: PropTypes.string.isRequired,
  aasmState: PropTypes.string,
  permissions: PropTypes.shape({
    create: PropTypes.bool,
    edit: PropTypes.bool,
    view: PropTypes.bool,
    show: PropTypes.bool,
    update: PropTypes.bool,
    delete: PropTypes.bool,
    save_draft: PropTypes.bool,
    send_for_approval: PropTypes.bool,
    reverse_approval: PropTypes.bool,
    approve: PropTypes.bool,
    deny: PropTypes.bool,
  }),
  hideDraft: PropTypes.bool,
  valid: PropTypes.bool,
  classes: PropTypes.object.isRequired,
};

const styles = (theme) => ({
  root: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  draftBtn: {
    maxWidth: "12.5em",
    color: "#2196f3",
    borderColor: "#2196f3",

    "&:hover": {
      backgroundColor: "#E1F5FE",
    },
    "&:focus": {
      backgroundColor: "#0D47A1",
      color: "#fff",
    },
  },
  sendForApprovalBtn: {
    maxWidth: "15em",
    borderColor: "#ffb300",
    color: "#ffb300",

    "&:hover, &:focus": {
      backgroundColor: "#ffc1071c",
      textShadow: "0 0 1px #FFE082",
    },
    "&:focus": {
      color: "#FFF8E1",
      backgroundColor: "#F9A825",
    },
  },
  denyBtn: {
    maxWidth: "12.5em",
    color: "#B71C1C",
    backgroundColor: "#FFEBEE",

    "&:hover, &:focus": {
      backgroundColor: "#EF9A9A",
    },
  },
  approveBtn: {
    maxWidth: "12.5em",
    color: "#008000",
    backgroundColor: "#dcedc8",

    "&:hover, &:focus": {
      backgroundColor: "#8BC34A",
    },
    "&:focus": {
      backgroundColor: "#008000",
      color: "#dcedc8",
    },
  },
  reverseApprovalBtn: {
    color: "#ffc107db",
    backgroundColor: "#FFF8E1",
    maxWidth: "15em",
    width: "max-content",
    borderColor: "#ffc107db",

    "&:hover, &:focus": {
      backgroundColor: "#ffc1071c",
      textShadow: "0 0 1px #FFE082",
    },
    "&:focus": {
      color: "#FFF8E1",
      backgroundColor: "#F9A825",
    },
  },
});

export default withStyles(styles)(StateBtns);
