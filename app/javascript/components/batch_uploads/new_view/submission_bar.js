import PropTypes from "prop-types";
import {makeStyles} from "@material-ui/core/styles";

import StateIcon from "@shared/state_icon";
import {titleize} from "@utils";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";

import SaveAltIcon from "@material-ui/icons/SaveAlt";

export default function SubmissionBar({aasmState = "draft", handleSubmit}) {
  const classes = useStyles();

  return (
    <AppBar
      position="fixed"
      component="footer"
      className={classes.submissionBar}
    >
      <Toolbar className={classes.toolbar}>
        <div className={classes.stateCell}>
          <h5 className={`currentState ${aasmState}`}>
            <b>Status:</b>
            <StateIcon aasmState={aasmState} />
            <span className="status">&nbsp;{titleize(aasmState)}</span>
          </h5>
        </div>

        <Button
          startIcon={<SaveAltIcon />}
          onClick={handleSubmit}
          variant="contained"
        >
          Submit Upload
        </Button>
      </Toolbar>
    </AppBar>
  );
}

SubmissionBar.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
};

const useStyles = makeStyles((theme) => ({
  submissionBar: {
    position: "fixed",
    top: "auto",
    bottom: 0,
    zIndex: 999,
    padding: 0,
  },
  toolbar: {
    display: "grid",
    gridColumnGap: theme.spacing(),
    gridTemplateColumns: "1fr 175px",
    justifyContent: "flex-start",
    margin: "auto 0",
  },
  stateCell: {
    "& h5.currentState": {
      margin: 0,
      fontSize: "16px",
      position: "relative",
      top: "0.125em",
      color: ({aasmState}) => theme.states[aasmState],
      display: "flex",
      justifyContent: "flex-start",
      paddingLeft: 8,
      alignItems: "center",

      "&.draft": {
        color: "#2196f3",
      },
      "&.approved": {
        color: "#4caf50",
      },
      "&.needs_revision, &.needs_approval": {
        color: "#ffb300",
      },

      "&.reversed": {
        color: "#f44336",
      },
      "& > b": {
        color: "#fcfcfc",
        display: "inline-block",
        marginRight: ".5rem",
      },
    },
  },
}));
