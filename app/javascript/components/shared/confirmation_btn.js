import PropTypes from "prop-types";
import {useState, Fragment} from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

const ConfirmationBtn = ({
  title,
  message = "Are you sure?",
  onClick = function() {},
  children,
  ...rest
}) => {
  const [open, setOpen] = useState(false);
  function handleClickOpen() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }

  const handleClick = e => {
    handleClose();
    onClick(e);
  };

  return (
    <Fragment>
      <Button {...rest} onClick={handleClickOpen}>
        {children}
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        {title && <DialogTitle id="alert-dialog-title">{title}</DialogTitle>}
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClick} color="primary">
            Confirm
          </Button>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};

ConfirmationBtn.propTypes = {
  title: PropTypes.string,
  message: PropTypes.string,
  onClick: PropTypes.func,
  children: PropTypes.node,
};

export default ConfirmationBtn;
