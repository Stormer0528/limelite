import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core/styles";

const EmptyMessage = ({classes = {}}) => (
  <div className={`well ${classes.well}`}>
    <h3>There are no items for the selected date range</h3>
    <p>Update the start and end dates above to find credit card records</p>
  </div>
);

const styles = (theme) => ({
  well: {
    textAlign: "center",
    borderTop: "none",

    ["& > h3"]: {
      fontSize: "18px",
    },
  },
});

EmptyMessage.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(EmptyMessage);
