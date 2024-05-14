import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core/styles";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";

import {green, amber} from "@material-ui/core/colors";

const UserNotification = ({
  visible = true,
  message,
  classes = {},
  messageType = null,
  // Callbacks
  handleClose = function () {},
}) => {
  if (!visible) {
    return null;
  }
  return (
    <Snackbar
      classes={{root: `${classes[messageType]}`}}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      open={visible}
      autoHideDuration={1500}
      onClose={handleClose}
      ContentProps={{
        "aria-describedby": "message-id",
      }}
      message={message}
      action={[
        <IconButton
          key="close"
          aria-label="Close"
          color="inherit"
          className={classes.close}
          onClick={handleClose}
        >
          <CloseIcon />
        </IconButton>,
      ]}
    />
  );
};

UserNotification.propTypes = {
  visible: PropTypes.bool,
  floating: PropTypes.bool,
  negative: PropTypes.bool,
  positive: PropTypes.bool,
  success: PropTypes.bool,
  warning: PropTypes.bool,
  info: PropTypes.bool,
  error: PropTypes.bool,
  color: PropTypes.string,
  messageType: PropTypes.string,
  message: PropTypes.string,
  header: PropTypes.any,
  list: PropTypes.array,
  handleClose: PropTypes.func,
  classes: PropTypes.object.isRequired,
};

const styles = (theme) => ({
  success: {
    ["& > div"]: {
      backgroundColor: green[600],
    },
  },
  error: {
    ["& > div"]: {
      backgroundColor: theme.palette.error.dark,
    },
  },
  info: {
    ["& > div"]: {
      backgroundColor: theme.palette.primary.dark,
    },
  },
  warning: {
    ["& > div"]: {
      backgroundColor: amber[700],
    },
  },
});

export default withStyles(styles)(UserNotification);
