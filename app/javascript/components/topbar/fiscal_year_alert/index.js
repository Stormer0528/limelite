import {withStyles} from "@material-ui/core/styles";
import PropTypes from "prop-types";

const FiscalYearAlert = ({open, setOpen, classes = {}}) => {
  if (!open) return null;

  return (
    <div className={classes.root}>
      <div className={classes.text}>
        You are doing entires in previous fiscal year
        <div className={classes.button} onClick={() => setOpen(false)}>
          &times;
        </div>
      </div>
    </div>
  );
};

FiscalYearAlert.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.bool.isRequired,
  classes: PropTypes.object.isRequired,
};

const styles = () => ({
  root: {
    textAlign: "center",
    position: "fixed",
    bottom: 10,
    width: "100%",
  },
  text: {
    margin: "auto",
    padding: "4px 8px",
    background: "rgba(150, 0, 0, 0.75)",
    color: "white",
    display: "inline-block",
    fontSize: "20px",
    borderRadius: 5,
  },
  button: {
    color: "white",
    cursor: "pointer",
    marginLeft: "10px",
    display: "inline-block",
    "&:hover": {
      opacity: 0.9,
    },
  },
});

export default withStyles(styles)(FiscalYearAlert);
