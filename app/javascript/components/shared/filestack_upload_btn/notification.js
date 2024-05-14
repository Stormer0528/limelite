import {Fragment} from "react";
import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core/styles";

import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";

import CloseIcon from "@material-ui/icons/Close";

const Notification = ({
  open = false,
  message,
  handleClose = function() {},
  classes = {},
}) => {
  return (
    <Snackbar
      className={classes.snackbar}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      open={open}
      onClose={handleClose}
      ContentProps={{
        "aria-describedby": "message-id",
      }}
      action={
        <IconButton
          key="close"
          aria-label="Close"
          color="inherit"
          className={classes.closeBtn}
          onClick={handleClose}
        >
          <CloseIcon />
        </IconButton>
      }
      message={
        <Fragment>
          <h5>There was an error uploading your content</h5>
          <div className={classes.message}>{message}</div>
        </Fragment>
      }
    ></Snackbar>
  );
};

Notification.propTypes = {
  open: PropTypes.bool,
  message: PropTypes.any,
  handleClose: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};

const styles = theme => ({
  closeBtn: {},
  snackbar: {
    "& > div": {
      backgroundColor: "#C62828",
      color: "#fff",

      "& h5": {
        fontWeight: 200,
      },

      "& button": {
        position: "absolute",
        top: 0,
        right: 0,
      },
    },
  },
});

export default withStyles(styles)(Notification);
