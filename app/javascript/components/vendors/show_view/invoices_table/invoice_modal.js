import InvoiceHeader from "./header";
import Invoice from "./invoice";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import Fade from "@material-ui/core/Fade";
import LinearProgress from "@material-ui/core/LinearProgress";
import {withStyles} from "@material-ui/core/styles";
import PropTypes from "prop-types";

const InvoiceModal = ({
  open = false,
  loading = false,
  handleClose = function () {},
  classes = {},
  id,
  path,
}) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="lg"
      aria-labelledby="entry-dialog-title"
    >
      <InvoiceHeader invoice={{path}} />

      {loading && (
        <LinearProgress
          classes={{
            barColorPrimary: classes.progressBarColor,
            colorPrimary: classes.progressBar,
          }}
          className={classes.progress}
        />
      )}

      <Fade in={!loading}>
        <DialogContent className={classes.content}>
          <Invoice id={id} />
        </DialogContent>
      </Fade>
    </Dialog>
  );
};
InvoiceModal.propTypes = {
  open: PropTypes.bool,
  loading: PropTypes.bool,
  entry: PropTypes.object,
  handleClose: PropTypes.func,
  classes: PropTypes.object.isRequired,
};

const styles = (theme) => ({
  dialogTitle: {
    "& h2": {
      display: "grid",
      gridTemplateColumns: "24px 1fr",
      alignItems: "center",
      gridColumnGap: ".25em",
    },
  },
  progress: {
    background: "#26383C",
  },
  progressBarColor: {
    background: "linear-gradient(to left, #3A7061, #DCE775, #3A7061)",
  },
  progressBar: {
    height: 2,
  },
  content: {
    padding: "8px",
  },
});

export default withStyles(styles)(InvoiceModal);
