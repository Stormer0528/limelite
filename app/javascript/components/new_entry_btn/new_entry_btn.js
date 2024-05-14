// Imports
//------------------------------------------------------------------------------
import {Fragment, useState, useCallback} from "react";
import PropTypes from "prop-types";
import {withStyles, useTheme} from "@material-ui/core/styles";
import {compose} from "redux";

// Material UI
import Snackbar from "@material-ui/core/Snackbar";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Tooltip from "@material-ui/core/Tooltip";

import NewEntryIcon from "@material-ui/icons/AddBoxOutlined";
import FinderDialog from "./finder_dialog_container";

//------------------------------------------------------------------------------
const NewEntryBtn = ({
  loading = false,
  valid = true,
  canimportEntries = false,
  notifications: {open: snackbar_open, notificationMessage} = {},
  handleSnackbarRequestClose = function () {},
}) => {
  const [open, setOpen] = useState(false);
  const handleOpenDialog = useCallback(() => {
    setOpen(!open);
  }, [open]);
  const {models: modelColors = {}} = useTheme();

  return (
    <Fragment>
      <ListItem button component="a" onClick={handleOpenDialog}>
        <Tooltip title="Create Entry" placement="right">
          <ListItemIcon>
            <NewEntryIcon style={{color: modelColors["Entry"].newEntry}} />
          </ListItemIcon>
        </Tooltip>
        <ListItemText>Journal Entry</ListItemText>
      </ListItem>
      <FinderDialog
        {...{open, loading, valid, canimportEntries, toggleModalOpen: setOpen}}
      />
      {notificationMessage && (
        <Snackbar
          open={snackbar_open}
          message={notificationMessage}
          autoHideDuration={4000}
          onClose={handleSnackbarRequestClose}
        />
      )}
    </Fragment>
  );
};

NewEntryBtn.propTypes = {
  data: PropTypes.object,
  valid: PropTypes.bool,
  loading: PropTypes.bool,
  canimportEntries: PropTypes.bool,
  handleSnackbarRequestClose: PropTypes.func.isRequired,
  notifications: PropTypes.shape({
    open: PropTypes.bool,
    notificationType: PropTypes.string,
    notificationMessage: PropTypes.string,
  }),
  handleOpenDialog: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};

const styles = () => ({
  icon: {
    color: "#0000008a",
  },
});

export default compose(withStyles(styles))(NewEntryBtn);
