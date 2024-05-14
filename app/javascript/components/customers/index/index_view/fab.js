import PropTypes from "prop-types";
import {compose} from "redux";
import {withStyles} from "@material-ui/core/styles";
import {withHandlers, withStateHandlers} from "recompose";

import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";

const FabBtn = ({handleClick = function() {}, classes = {}}) => {
  return (
    <Fab
      color="primary"
      aria-label="Add Customer"
      className={classes.speedDial}
      onClick={handleClick("/customers/new")}
    >
      <AddIcon />
    </Fab>
  );
};

FabBtn.propTypes = {
  hidden: PropTypes.bool,
  open: PropTypes.bool,
  handleOpen: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleClick: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};

const styles = theme => ({
  speedDial: {
    backgroundColor: "#4CAF50",
    position: "fixed",
    right: "23px",
    bottom: "23px",
    marginBottom: "0",
    zIndex: "997",

    "&:hover": {
      backgroundColor: "#43A047",
    },
  },
});

export default compose(
  withStyles(styles),
  withStateHandlers(
    ({initialOpen = false}) => ({
      open: initialOpen,
    }),
    {
      handleClose: () => () => {
        return {open: false};
      },
      handleOpen: () => () => {
        return {open: true};
      },
    }
  ),
  withHandlers({
    handleClick: _props => path => _e => {
      window.location = path;
    },
  })
)(FabBtn);
