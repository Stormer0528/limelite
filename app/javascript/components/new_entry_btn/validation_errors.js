import PropTypes from "prop-types";

// Material UI
import Fade from "@material-ui/core/Fade";
import {withStyles} from "@material-ui/core/styles";

const ValidationErrors = ({errors = [], classes = {}}) => {
  if (errors.length < 1) {
    return null;
  }

  return (
    <Fade in>
      <ul className={`validation-errors ${classes.list}`}>
        {errors.map((error, i) => (
          <li key={i} className={classes.item}>
            {error}
          </li>
        ))}
      </ul>
    </Fade>
  );
};

ValidationErrors.propTypes = {
  errors: PropTypes.arrayOf(PropTypes.string),
  classes: PropTypes.object,
};

// Styles
const styles = theme => ({
  list: {
    border: "2px solid #E91E63",
    padding: "1em",
    borderRadius: "3px",
    background: "#FCE4EC",
  },
  item: {
    listStyleType: "disc !important",
    marginLeft: "2rem",
    fontWeight: "300",
    color: "#B71C1C",
    fontSize: "1.15rem",
  },
});

export default withStyles(styles)(ValidationErrors);
