import ButtonGroup from "@material-ui/core/ButtonGroup";
import DialogTitle from "@material-ui/core/DialogTitle";
import Fade from "@material-ui/core/Fade";
import {withStyles} from "@material-ui/core/styles";
import OpenFileIcon from "@material-ui/icons/FindInPage";
import Receipt from "@material-ui/icons/Receipt";
import PropTypes from "prop-types";

const InvoiceHeader = ({
  loading = false,
  invoice: {path} = {},
  classes = {},
}) => {
  return (
    <DialogTitle id="invoice-dialog-title" className={classes.dialogTitle}>
      <Receipt />

      <div>Invoice</div>
      <Fade in={!loading}>
        <ButtonGroup variant="text" className={classes.buttons}>
          {/* Invoice Btn */}
          <a href={path} className={classes.button} target="_blank">
            <OpenFileIcon />
            View
          </a>
        </ButtonGroup>
      </Fade>
    </DialogTitle>
  );
};
InvoiceHeader.propTypes = {
  open: PropTypes.bool,
  loading: PropTypes.bool,
  handleClose: PropTypes.object,
  invoice: PropTypes.shape({
    path: PropTypes.string,
  }),
  classes: PropTypes.object.isRequired,
};

const styles = (theme) => ({
  dialogTitle: {
    "& h2": {
      display: "grid",
      gridTemplateColumns: "42px max-content 1fr",
      alignItems: "center",
      gridColumnGap: ".25em",
    },
  },
  buttons: {
    display: "flex",
    justifyContent: "flex-end",
  },
  button: {
    display: "flex",
    alignItems: "center",
    color: "#607D8B",
    opacity: ".85",
    marginLeft: "0.25rem",

    "&:hover": {
      // background: "transparent",
      opacity: 1,
      willChange: "opacity",
      transition: "opacity .15s linear",
    },
  },
});

export default withStyles(styles)(InvoiceHeader);
