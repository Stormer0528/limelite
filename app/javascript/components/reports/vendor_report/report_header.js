import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core/styles";

const ReportHeader = ({organizationName, classes = {}}) => {
  return <h3 className={classes.root}>{organizationName} Vendor Report</h3>;
};

ReportHeader.propTypes = {
  organizationName: PropTypes.string,
  classes: PropTypes.object,
};

const styles = theme => ({
  root: {
    textAlign: "center",
    fontSize: "1.75em",
    fontWeight: "300",
    margin: "1em 0 .25em",
  },
});

export default withStyles(styles)(ReportHeader);
