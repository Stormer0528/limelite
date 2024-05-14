import PropTypes from "prop-types";
import {useCurrentRoute} from "react-navi";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import LinearProgress from "@material-ui/core/LinearProgress";
import ConfirmationBtn from "../../../shared/confirmation_btn";
import API from "../../api";

import {titleCase} from "humanize-plus";
import decamelize from "decamelize";
import clsx from "clsx";
import {withStyles} from "@material-ui/core/styles";

// Icons
import DraftIcon from "@material-ui/icons/InsertDriveFile";
import SendApprovalIcon from "@material-ui/icons/Send";
import DeleteIcon from "@material-ui/icons/DeleteForever";
import DenyIcon from "@material-ui/icons/Block";
import PrintIcon from "@material-ui/icons/Print";
import VoidIcon from "@material-ui/icons/Block";
import ApproveIcon from "@material-ui/icons/Done";
import ReverseApprovalIcon from "@material-ui/icons/Autorenew";

const SubmissionBar = ({
  setFieldValue = function () {},
  handleSubmit = function () {},
  isSubmitting = false,
  aasmState = "draft",
  hideDraft = false,
  hideDelete = false,
  disabled = false,
  permissions: passedPermissions = {},
  classes = {},
}) => {
  const {
    data: {
      permissions: pagePermissons = {},
      purchaseOrderPermissions = {},
      vendor: {slug} = {},
      purchaseOrder: {id, permissions: poPermissions} = {},
    } = {},
  } = useCurrentRoute();

  const permissions = {
    ...purchaseOrderPermissions,
    ...pagePermissons,
    ...poPermissions,
    ...passedPermissions,
  };

  const submitHandler = (stateAction) => (e) => {
    e.persist();
    setFieldValue("stateAction", stateAction);
    setTimeout(() => {
      handleSubmit(e);
    }, 100);
  };

  const handleDelete = async () => {
    await API.destroyCheck(id);
    window.location = `/bank_accounts/${slug}`;
  };

  return (
    <AppBar className={classes.root} component="footer">
      {isSubmitting && (
        <LinearProgress
          classes={{
            colorPrimary: classes.progressBar,
          }}
          className={classes.progress}
        />
      )}
      <Toolbar className={classes.toolbar}>
        <h5 className={classes.stateHeader}>
          <b>Status:&nbsp;</b>
          <span className={clsx(["state", aasmState])}>
            {titleCase(decamelize(aasmState, " ").replace(/_/, " "))}
          </span>
        </h5>
        <div className={classes.stateBtns}>
          {!hideDraft &&
            ["draft", "needs_revision"].includes(aasmState) &&
            permissions.save_draft && (
              <Button
                variant="outlined"
                onClick={submitHandler("save_draft")}
                disabled={disabled}
                className={classes.draftBtn}
              >
                <DraftIcon className={classes.icon} />
                Save&nbsp;Draft
              </Button>
            )}
          {aasmState === "needs_approval" && permissions.approve && (
            <Button
              variant="outlined"
              onClick={submitHandler("approve")}
              disabled={disabled}
              className={classes.approveBtn}
            >
              <ApproveIcon className={classes.icon} />
              Approve
            </Button>
          )}
          <div style={{height: ".5rem"}}>&nbsp;</div>
          {["draft", "needs_revision"].includes(aasmState) &&
            permissions.send_for_approval && (
              <Button
                variant="outlined"
                onClick={submitHandler("send_for_approval")}
                disabled={disabled}
                className={classes.sendForApprovalBtn}
              >
                <SendApprovalIcon className={classes.icon} />
                Send&nbsp;for&nbsp;Approval
              </Button>
            )}
          {aasmState === "needs_approval" && permissions.deny && (
            <Button
              variant="outlined"
              onClick={submitHandler("deny")}
              disabled={disabled}
              className={classes.denyBtn}
            >
              <DenyIcon className={classes.icon} />
              Deny
            </Button>
          )}
          {aasmState === "approved" && permissions.reverse_approval && (
            <Button
              variant="outlined"
              onClick={submitHandler("reverse_approval")}
              disabled={disabled}
              className={classes.reverseApprovalBtn}
            >
              <ReverseApprovalIcon className={classes.icon} />{" "}
              Reverse&nbsp;Approval
            </Button>
          )}
          <div style={{height: ".5rem"}}>&nbsp;</div>
          {aasmState === "approved" && permissions.print && (
            <ConfirmationBtn
              variant="outlined"
              onClick={submitHandler("print")}
              disabled={disabled}
              className={classes.printBtn}
              message={
                "Are you sure you want to manually mark this as printed?"
              }
            >
              <PrintIcon className={classes.icon} />
              Print
            </ConfirmationBtn>
          )}
          <div style={{height: ".5rem"}}>&nbsp;</div>
          {["approved", "printed"].includes(aasmState) && permissions.void && (
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
          )}
          <div style={{height: ".5rem"}}>&nbsp;</div>
          {!hideDelete && permissions.delete && (
            <ConfirmationBtn
              variant="outlined"
              onClick={handleDelete}
              disabled={disabled}
              className={classes.deleteBtn}
              message={"Are you sure you want to delete this record?"}
            >
              <DeleteIcon className={classes.icon} />
              Delete
            </ConfirmationBtn>
          )}
        </div>
      </Toolbar>
    </AppBar>
  );
};

SubmissionBar.propTypes = {
  setFieldValue: PropTypes.func.isRequired,
  aasmState: PropTypes.string,
  disabled: PropTypes.bool,
  hideDraft: PropTypes.bool,
  hideDelete: PropTypes.bool,
  isValidating: PropTypes.bool,
  isSubmitting: PropTypes.bool,
  permissions: PropTypes.shape({
    create: PropTypes.bool,
    edit: PropTypes.bool,
    view: PropTypes.bool,
    show: PropTypes.bool,
    update: PropTypes.bool,
    delete: PropTypes.bool,
    print: PropTypes.bool,
    void: PropTypes.bool,
    save_draft: PropTypes.bool,
    send_for_approval: PropTypes.bool,
    reverse_approval: PropTypes.bool,
    approve: PropTypes.bool,
    deny: PropTypes.bool,
  }),
  handleSubmit: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};

const styles = (theme) => {
  return {
    root: {
      top: "auto",
      bottom: 0,
      backgroundColor: "#cfd8dc",
      display: "fixed",
    },
    toolbar: {
      minHeight: "48px",
      display: "flex",
      justifyContent: "flex-end",
    },
    progress: {
      height: "2px",
    },
    progressBar: {
      background: "#43A047",
    },
    stateBtns: {
      display: "flex",
    },
    stateHeader: {
      flexGrow: 1,
      fontSize: "16px",
      margin: "0 1rem 0 0",

      "& > b": {color: "#333"},
      "& > span": {
        color: "red",
        "&.draft": {
          color: theme.states.draft,
        },
        "&.approved": {
          color: theme.states.approved,
        },
        "&.needsApproval": {
          color: theme.states.needs_revision,
        },
        "&.needs_approval": {
          color: theme.states.needs_revision,
        },
        "&.needs_revision": {
          color: theme.states.needs_revision,
        },
        "&.needsRevision": {
          color: theme.states.needs_revision,
        },
        "&.reversed": {
          color: theme.states.reversed,
        },
        "&.printed": {
          color: theme.states.printed,
        },
      },
    },
    deleteBtn: {
      border: "1px solid #F44336",
      color: "#F44336",
      padding: "5px 8px 5px 4px",
      marginLeft: "1rem",

      "&:hover, &:focus": {
        color: "white",
        background: "#F44336",
      },
    },
    icon: {
      marginRight: theme.spacing(),
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
  };
};

export default withStyles(styles)(SubmissionBar);
