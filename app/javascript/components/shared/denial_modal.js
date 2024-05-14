import PropTypes from "prop-types";
import {Fragment, useState} from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import TextField from "@material-ui/core/TextField";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import HistoryIcon from "@material-ui/icons/History";

const DenialModal = ({open = false, handleReasonChange = function () {}}) => {
  const [isOpen, setOpenValue] = useState(open);
  const handleClose = () => {
    setOpenValue(false);
  };

  const handleOpen = () => {
    setOpenValue(true);
  };

  return (
    <Fragment>
      <Tooltip title="Approval History" placement="top">
        <IconButton onClick={handleOpen}>
          <HistoryIcon />
        </IconButton>
      </Tooltip>
      <Dialog
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="approval-history-dialog-title"
        maxWidth="md"
        fullWidth
      >
        <DialogTitle id="approval-history-dialog-title">
          <div
            style={{
              display: "flex",
            }}
          >
            <HistoryIcon /> &nbsp;&nbsp;Denial Reason
          </div>
        </DialogTitle>
        <DialogContent>
          <p>
            <b>Reason For Denial:</b>
            <TextField multiline rows="4" onChange={handleReasonChange} />
          </p>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
};

DenialModal.propTypes = {
  approver: PropTypes.string,
  open: PropTypes.bool,
  handleReasonChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

export default DenialModal;
