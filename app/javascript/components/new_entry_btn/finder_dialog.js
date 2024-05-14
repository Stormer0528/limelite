import PropTypes from "prop-types";
import cx from "clsx";
// Material UI
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import {withStyles} from "@material-ui/core/styles";
import {useFormikContext} from "formik";
import {NewAccountModalProvider} from "../accounts/account_modal/context";

// Components
import EntryIcon from "../shared/icons/entry_icon";
import FinderDialogInner from "./finder_dialog_inner";
import UploadEntriesIcon from "@material-ui/icons/Receipt";

const FinderDialog = ({
  classes = {},
  valid = true,
  open = false,
  canimportEntries = true,
  handleSubmitClick = () => {},
  handleCloseDialog = () => {},
  handleCancelClick = () => {},
}) => {
  const {
    handleChange,
    handleBlur,
    setFieldValue,
    handleAccountFinderUpdate,
  } = useFormikContext();

  return (
    <Dialog
      open={open}
      onClose={handleCloseDialog}
      aria-labelledby="form-dialog-title"
      classes={{paperWidthSm: classes.dialogSm}}
      fullWidth={true}
    >
      <NewAccountModalProvider
        value={{handleOnAccountCreated: handleAccountFinderUpdate}}
      >
        <DialogTitle
          id="form-dialog-title"
          disableTypography={true}
          className={classes.dialogTitle}
        >
          <header className={classes.header}>
            <Avatar className={classes.avatar}>
              <EntryIcon />
            </Avatar>
            <h4 className={classes.headerTitle}>New Entry</h4>
          </header>
          {canimportEntries && (
            <Button
              variant="outlined"
              color="primary"
              key="import-entries"
              href="/admin/import-entries"
              className="import-entries"
            >
              <UploadEntriesIcon />
              &nbsp; Upload Entries
            </Button>
          )}
        </DialogTitle>
        <FinderDialogInner {...{handleChange, handleBlur, setFieldValue}} />
        <DialogActions>
          <Button color="primary" key="cancel" onClick={handleCancelClick}>
            Cancel
          </Button>
          <Button
            key="submit"
            color="primary"
            disabled={!valid}
            onClick={handleSubmitClick}
          >
            + Create Entry
          </Button>
        </DialogActions>
      </NewAccountModalProvider>
    </Dialog>
  );
};

FinderDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  valid: PropTypes.bool,
  loading: PropTypes.bool,
  open: PropTypes.bool,
  canimportEntries: PropTypes.bool,
  handleCloseDialog: PropTypes.func.isRequired,
  handleCancelClick: PropTypes.func.isRequired,
  handleSubmitClick: PropTypes.func.isRequired,
};

const styles = (theme) => ({
  dialogSm: {
    maxWidth: "95%",
  },
  dialogTitle: {
    padding: "0 1.5rem 0",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
  dialogContent: {
    padding: `0 ${2 * theme.spacing(1)}px 0`,
  },
  header: {
    display: "grid",
    gridTemplateColumns: "calc(40px + 0.75rem) 1fr",
    justifyContent: "center",
    alignItems: "center",
    borderBottom: "1px solid #f5f5f5",
  },
  avatar: {
    background: "linear-gradient(to bottom right, #B0BEC5, #607D8B)",
  },
  headerTitle: {
    fontSize: "2.28rem",
    lineHeight: "110%",
    margin: "1.52rem 0 0.912rem 0",
    fontWeight: 400,
    position: "relative",
    top: "-.125rem",
  },
});

export default withStyles(styles)(FinderDialog);
