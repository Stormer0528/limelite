import {useState} from "react";
import PropTypes from "prop-types";
import {useCallback} from "react";
import {makeStyles} from "@material-ui/core/styles";
import {useMutation} from "react-apollo";

import DenialModal from "../../../shared/auth_footer/denial_modal";

import Button from "@material-ui/core/Button";
import DialogActions from "@material-ui/core/DialogActions";
import ApproveIcon from "@material-ui/icons/ThumbUp";
import DenyIcon from "@material-ui/icons/ThumbDown";

import AUTHORIZATION_QUERY from "../../../../graphql/mutations/authorize.gql";

const ApprovalFooter = ({
  handleClose,
  setValidationErrors,
  id: authableId,
  type: authableType,
}) => {
  const cl = useStyles();

  const [authorizeItem] = useMutation(AUTHORIZATION_QUERY, {
    variables: {
      authableType,
      authableId,
    },
    onCompleted: ({authorization: {success, errorMessages = []}}) => {
      if (success) {
        handleClose();
      } else {
        setValidationErrors(errorMessages);
      }
    },
  });

  const handleApproveClick = useCallback(
    ({authableAction, reason}) => () => {
      authorizeItem({
        variables: {
          authableAction,
          reason,
        },
      });
    },
    [authorizeItem]
  );

  const [denialModalOpen, setDenialModalOpen] = useState(false);
  const handleModalOpen = useCallback(() => {
    setDenialModalOpen(true);
  }, [setDenialModalOpen]);

  const handleModalClose = useCallback(() => {
    setDenialModalOpen(false);
  }, [setDenialModalOpen]);

  return (
    <DialogActions className={cl.root}>
      <div className={cl.cancelContainer}>
        <Button onClick={handleClose}>Cancel</Button>
      </div>
      <Button
        fullWidth
        className={cl.denyBtn}
        onClick={handleModalOpen}
        startIcon={<DenyIcon />}
      >
        Deny
      </Button>
      <DenialModal
        {...{
          open: denialModalOpen,
          handleClose: handleModalClose,
          handleSave: authorizeItem,
        }}
      />
      <Button
        fullWidth
        onClick={handleApproveClick({authableAction: "Approve"})}
        className={cl.approveBtn}
        endIcon={<ApproveIcon />}
      >
        Approve
      </Button>
    </DialogActions>
  );
};

ApprovalFooter.propTypes = {
  handleClose: PropTypes.func,
  setValidationErrors: PropTypes.func,
  id: PropTypes.string,
  type: PropTypes.string,
};

const useStyles = makeStyles(({approvalBtns: {approveBtn, denyBtn}}) => {
  return {
    root: {
      borderTop: "1px solid #f0f0f0",
      background: "linear-gradient(to bottom, #f5f5f5, #fcfcfc)",
    },
    cancelContainer: {
      flexGrow: 1,
      display: "flex",
      justifyContent: "flex-start",
    },
    approveBtn: {
      ...approveBtn,
      "& svg": {
        position: "relative",
        top: "-1.75px",
      },
    },
    denyBtn: {
      ...denyBtn,
      "& svg": {
        position: "relative",
        top: "1.75px",
      },
    },
  };
});

export default ApprovalFooter;
