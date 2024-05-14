import {useCallback, useState, Fragment} from "react";
import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core/styles";

import Button from "@material-ui/core/Button";
import DenialModal from "./submission_bar/denial_modal";
import ConfirmationBtn from "@shared/confirmation_btn";
// Icons
import DenyIcon from "@material-ui/icons/Block";
import ApproveIcon from "@material-ui/icons/Done";
import ReverseApprovalIcon from "@material-ui/icons/Autorenew";
import SaveDraftIcon from "./icons/state_actions/save_draft";
import SendForApprovalIcon from "./icons/state_actions/send_for_approval";
import PrintIcon from "@material-ui/icons/Print";
import VoidIcon from "@material-ui/icons/Block";

const StateBtns = ({
  aasmState = "draft",
  permissions = {},
  valid = true,
  hideDraft = false,
  createSubmitHandler: submitHandler = () => () => {},
  disabled = false,
  check = false,
  classes = {},
}) => {
  const [denialAction, setDenialAction] = useState("");
  const [denialModalOpen, setDenialModalOpen] = useState(false);
  const handleOpen = useCallback(
    (action) => () => {
      setDenialAction(action);
      setDenialModalOpen(true);
    },
    [setDenialModalOpen]
  );

  const handleClose = useCallback(() => {
    setDenialModalOpen(false);
  }, [setDenialModalOpen]);

  const handleSave = useCallback(
    ({action, reason = ""}) => {
      submitHandler(action, reason)();
    },
    [submitHandler]
  );

  return (
    <div className={classes.root}>
      <DenialModal
        {...{
          open: denialModalOpen,
          handleClose,
          handleSave,
          action: denialAction,
        }}
      />
      {!hideDraft &&
        ["draft", "needs_revision"].includes(aasmState) &&
        permissions.save_draft && (
          <Button
            startIcon={<SaveDraftIcon />}
            variant="outlined"
            onClick={submitHandler("save_draft")}
            disabled={!valid}
            className={classes.draftBtn}
          >
            Save&nbsp;Draft
          </Button>
        )}
      {["needs_approval", "needsApproval"].includes(aasmState) &&
        permissions.approve && (
          <Button
            variant="outlined"
            fullWidth
            onClick={submitHandler("approve")}
            disabled={disabled}
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
            startIcon={<SendForApprovalIcon />}
            variant="outlined"
            fullWidth
            onClick={submitHandler("send_for_approval")}
            disabled={!valid}
            className={classes.sendForApprovalBtn}
          >
            Send&nbsp;for&nbsp;Approval
          </Button>
        )}
      {["needs_approval", "needsApproval"].includes(aasmState) &&
        permissions.deny && (
          <Button
            variant="outlined"
            fullWidth
            onClick={handleOpen("deny")}
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
          onClick={handleOpen("reverse_approval")}
          disabled={!valid}
          className={classes.reverseApprovalBtn}
          startIcon={<ReverseApprovalIcon />}
        >
          Reverse Approval
        </Button>
      )}
      {check && aasmState === "approved" && permissions.print && (
        <Fragment>
          <div style={{height: ".5rem"}}>&nbsp;</div>
          <ConfirmationBtn
            variant="outlined"
            onClick={submitHandler("print")}
            disabled={disabled}
            className={classes.printBtn}
            message={"Are you sure you want to manually mark this as printed?"}
          >
            <PrintIcon className={classes.icon} />
            Print
          </ConfirmationBtn>
        </Fragment>
      )}
      {check &&
        ["approved", "printed"].includes(aasmState) &&
        permissions.void && (
          <Fragment>
            <div style={{height: ".5rem"}}>&nbsp;</div>
            <ConfirmationBtn
              variant="outlined"
              onClick={submitHandler("void")}
              disabled={disabled}
              className={classes.voidBtn}
              message={
                "Are you sure you want to void this check? This process is irreversible."
              }
            >
              <VoidIcon className={classes.icon} />
              Void
            </ConfirmationBtn>
          </Fragment>
        )}
    </div>
  );
};

StateBtns.propTypes = {
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  check: PropTypes.bool /* show check specific buttons */,
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
  disabled: PropTypes.bool,
  valid: PropTypes.bool,
  createSubmitHandler: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};

const styles = (theme) => ({
  root: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  icon: {
    marginRight: theme.spacing(1),
  },
  printBtn: {
    maxWidth: "12.5em",
    color: "#008000",
    backgroundColor: "#E8F5E9",

    "&:focus": {
      backgroundColor: "#008000",
      color: "#dcedc8",
    },
    "&:hover": {
      color: "#E8F5E9",
      backgroundColor: "#008000",
    },
  },
  voidBtn: {
    color: "#D84315",
    border: "1px solid #D84315",
    background: "#f1e6e3",

    "&:hover": {
      color: "white",
      background: "#D84315",
    },
  },
  ...theme.approvalBtns,
});

export default withStyles(styles)(StateBtns);
