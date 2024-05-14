import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core/styles";

import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";

import LinearProgress from "@material-ui/core/LinearProgress";
import Fade from "@material-ui/core/Fade";

import Header from "./header";
import Entry from "./entry";

const EntryModal = ({
  open = false,
  loading = false,
  entry = {},
  handleClose = function () {},
  classes = {},
}) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="lg"
      aria-labelledby="entry-dialog-title"
    >
      <Header {...{entry, loading}} />
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
          <Entry {...{entry}} />
        </DialogContent>
      </Fade>
    </Dialog>
  );
};
EntryModal.propTypes = {
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

export default withStyles(styles)(EntryModal);
