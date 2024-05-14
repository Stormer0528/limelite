import PropTypes from "prop-types";
import clsx from "clsx";

import PrintIcon from "@material-ui/icons/Print";
import VoidIcon from "@material-ui/icons/Block";

import {withStyles} from "@material-ui/core/styles";

const StatusBar = ({printed = false, voided = false, classes = {}}) => {
  if (![printed, voided].some(v => v)) {
    return null;
  }
  return (
    <div className={clsx(classes.root, {voided, printed})}>
      {printed && (
        <b className={classes.printed}>
          <PrintIcon /> Check has been printed
        </b>
      )}
      {voided && (
        <b className={classes.voided}>
          <VoidIcon /> Check has been voided
        </b>
      )}
    </div>
  );
};

StatusBar.propTypes = {
  entryId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  printed: PropTypes.bool,
  voided: PropTypes.bool,
  classes: PropTypes.object.isRequired,
};

const styles = theme => ({
  root: {
    margin: "0 -8px",
    background: "#fcfcfc",
    padding: ".25rem 16px",
    border: "1px solid #eee",
    borderWidth: "1px 0",
    color: "#616161",

    "& > b": {
      display: "flex",
      justifyContent: "center",

      "& > svg": {
        marginRight: ".5rem",
      },
    },

    "&.printed": {
      color: "#33691E",
      background: "#DCEDC8",
      borderColor: "#C5E1A5",
    },

    "&.voided": {
      background: "#FFEBEE",
      color: "#C62828",
      borderColor: "#FFCDD2",
    },
  },
  printed: {},
  voided: {},
});

export default withStyles(styles)(StatusBar);
