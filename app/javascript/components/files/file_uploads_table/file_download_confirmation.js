import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";

const FileDownloadConfirmationDialog = ({open, onConfirm, onClose}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent>Do you want to mark the file as downloaded?</DialogContent>

      <DialogActions>
        <Button color="primary" onClick={onConfirm}>
          Yes
        </Button>

        <Button color="primary" onClick={onClose}>
          No
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FileDownloadConfirmationDialog;
