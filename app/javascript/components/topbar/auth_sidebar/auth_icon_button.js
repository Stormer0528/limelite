import Badge from "@material-ui/core/Badge";
import IconButton from "@material-ui/core/IconButton";
import {withStyles} from "@material-ui/core/styles";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import NotificationIcon from "@material-ui/icons/Inbox";
import PropTypes from "prop-types";
import {useCallback} from "react";

const AuthIconBtn = ({
  itemCount = 0,
  handleOpen,
  handleClose,
  open,
  classes = {},
  // ...rest
}) => {
  const onClick = useCallback(() => {
    if (open) {
      handleClose();
    } else {
      handleOpen();
    }
  }, [handleOpen, handleClose, open]);

  return (
    <IconButton
      edge="end"
      className={classes.menuButton}
      color="inherit"
      aria-label="Authorization Inbox"
      onClick={onClick}
    >
      <Badge
        badgeContent={itemCount}
        max={49}
        invisible={open || itemCount === 0}
        color="error"
      >
        {open ? <ChevronRightIcon /> : <NotificationIcon />}
      </Badge>
    </IconButton>
  );
};
AuthIconBtn.propTypes = {
  itemCount: PropTypes.number,
  handleClose: PropTypes.func,
  handleOpen: PropTypes.func,
  open: PropTypes.bool,
  classes: PropTypes.object.isRequired,
};

const styles = () => ({});

export default withStyles(styles)(AuthIconBtn);
