import PropTypes from "prop-types";
import {useCallback, Fragment, useState} from "react";
import {makeStyles} from "@material-ui/core/styles";
import {useMutation} from "react-apollo";
import isNull from "lodash/isNull";

import ValidationErrors from "../validation_errors";
import AuthProgress from "./auth_progress";
import DenialModal from "./denial_modal";

import Button from "@material-ui/core/Button";
import Fade from "@material-ui/core/Fade";
import Typography from "@material-ui/core/Typography";
import Alert from "@material-ui/lab/Alert";
import AlertTitle from "@material-ui/lab/AlertTitle";

import ApproveIcon from "@material-ui/icons/ThumbUp";
import DenyIcon from "@material-ui/icons/ThumbDown";
import SuccessIcon from "@material-ui/icons/CheckCircleOutline";
import AuthorizationIcon from "../../shared/icons/authorization_icon";

import AUTHORIZATION_QUERY from "../../../graphql/mutations/authorize.gql";

const ApprovalFooter = ({
  aasmState,
  canAuthorize = false,
  id: authableId,
  type: authableType,
  authorizations = [],
  authorizationPath = [],
  authorizationPathIndex = 0,
}) => {
  const cl = useStyles({aasmState, canAuthorize});
  const [denialModalOpen, setDenialModalOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);
  const [success, setSuccess] = useState(null);
  const [authorizeItem, {loading}] = useMutation(AUTHORIZATION_QUERY, {
    variables: {
      authableType,
      authableId,
    },
    onCompleted: ({authorization: {success, errorMessages = []}}) => {
      setValidationErrors(errorMessages);
      setSuccess(success);
      window.location.reload();
    },
  });

  const handleOpen = useCallback(() => {
    setDenialModalOpen(true);
  }, [setDenialModalOpen]);

  const handleClose = useCallback(() => {
    setDenialModalOpen(false);
  }, [setDenialModalOpen]);

  const handleApproveClick = useCallback(
    ({authableAction, reason}) =>
      () => {
        authorizeItem({
          variables: {
            authableAction,
            reason,
          },
        });
      },
    [authorizeItem]
  );

  if (aasmState === "draft") {
    return null;
  }

  const {reason = ""} = authorizations[authorizations.length - 1] || {};
  const denialReason = (reason || "").replace(/\n\n/g, "\n");

  return (
    <Fragment>
      <div className={cl.root}>
        <h3 className={cl.header}>
          <AuthorizationIcon />
          Authorizations
        </h3>
        {canAuthorize && isNull(success) && (
          <div className={cl.authBtns}>
            <Button
              fullWidth
              disabled={loading}
              className={cl.denyBtn}
              onClick={handleOpen}
              startIcon={<DenyIcon />}
            >
              Deny
            </Button>
            <Button
              fullWidth
              disabled={loading}
              onClick={handleApproveClick({authableAction: "Approve"})}
              className={cl.approveBtn}
              endIcon={<ApproveIcon />}
            >
              Approve
            </Button>
            <DenialModal
              {...{
                open: denialModalOpen,
                handleClose: handleClose,
                handleSave: authorizeItem,
              }}
            />
          </div>
        )}
        {success && (
          <Fade in>
            <span className={cl.successMessage}>
              <SuccessIcon /> saved
            </span>
          </Fade>
        )}
        {authorizationPath && (
          <div className={cl.auths}>
            <AuthProgress
              {...{authorizations, authorizationPath, authorizationPathIndex}}
            />
          </div>
        )}
      </div>
      {validationErrors.length > 0 && (
        <div className={cl.validationContainer}>
          <ValidationErrors errors={validationErrors} />
        </div>
      )}

      {aasmState === "needs_revision" && denialReason && (
        <Alert severity="warning">
          <AlertTitle>Authorization Issues:</AlertTitle>
          <Typography varian="body" className={cl.errorMessageBody}>
            {denialReason}
          </Typography>
        </Alert>
      )}
    </Fragment>
  );
};

ApprovalFooter.propTypes = {
  aasmState: PropTypes.string,
  canAuthorize: PropTypes.bool,
  setValidationErrors: PropTypes.func,
  id: PropTypes.string,
  type: PropTypes.string,
  authorizations: PropTypes.array,
  authorizationPath: PropTypes.array,
  authorizationPathIndex: PropTypes.number,
};

const useStyles = makeStyles((theme) => {
  const {
    approvalBtns: {approveBtn, denyBtn},
    // states = {},
  } = theme;
  return {
    root: {
      borderTop: "1px solid #f0f0f0",
      display: "grid",
      padding: "8px 16px",
      alignItems: "center",
      background:
        "linear-gradient(to right, #F5F5F5, #F5F5F5 250px, whitesmoke)",
      gridTemplateColumns: "minmax(min-content, max-content) 1fr 150px 150px",
      gridColumnGap: 8,
    },
    header: {
      flexGrow: 1,
      margin: 0,
      display: "flex",
      justifyContent: "flex-start",
      fontWeight: 900,
      fontSize: "16px",
      alignItems: "center",

      "& > svg": {
        marginRight: ".125em",
      },
    },
    subheader: {
      gridColumn: 1,
    },
    auths: {
      gridColumnStart: 2,
      gridColumnEnd: ({canAuthorize}) => (canAuthorize ? 2 : 5),
      gridRow: 1,
    },
    approveBtn: {
      ...approveBtn,
      gridColumn: 3,
      gridRow: 1,

      "& svg": {
        position: "relative",
        top: "-1.75px",
      },
    },
    denyBtn: {
      ...denyBtn,
      gridColumn: 4,
      gridRow: 1,

      "& svg": {
        position: "relative",
        top: "1.75px",
      },
    },
    validationContainer: {
      padding: "0 8px",
    },
    errorMessageBody: {
      whiteSpace: "pre",
    },
    successMessage: {
      display: "flex",
      alignItems: "center",
      color: "green",
      fontSize: "1.125rem",
      fontWeight: 500,
      gridColumnStart: 3,
      gridColumnEnd: 4,
      justifyContent: "flex-end",

      "& > svg": {marginRight: ".35rem"},
    },
  };
});

export default ApprovalFooter;
