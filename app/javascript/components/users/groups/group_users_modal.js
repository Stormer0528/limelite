import PropTypes from "prop-types";
import {makeStyles} from "@material-ui/core/styles";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";

import UserGroupForm from "./group_users_form";

const UsersGroupModal = ({open, handleClose, ...props}) => {
  const classes = useStyles();

  return (
    <Dialog
      fullWidth
      maxWidth="md"
      onClose={handleClose}
      aria-labelledby="users-group-title"
      open={open}
    >
      <DialogTitle className={classes.title} id="users-group-title">
        {props.name} Users
      </DialogTitle>
      <UserGroupForm {...props} handleClose={handleClose} />
    </Dialog>
  );
};

UsersGroupModal.propTypes = {
  name: PropTypes.string,
  action: PropTypes.oneOf(["new", "edit"]),
  open: PropTypes.bool,
  handleOpen: PropTypes.func,
  handleClose: PropTypes.func,
};

const useStyles = makeStyles(() => ({
  root: {},
  title: {
    borderBottom: "1px solid #eee",
    background: "linear-gradient(to bottom, #fcfcfc, #f5f5f5)",
    padding: 8,
  },
}));

export default UsersGroupModal;
