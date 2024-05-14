import {Fragment} from "react";
import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core/styles";

const ReportHeader = ({organizationName, classes = {}}) => {
  return (
    <Fragment>
      <h1 className={classes.orgName}>{organizationName}</h1>
      <h3 className={classes.reportName}>Check Register</h3>
    </Fragment>
  );
};

ReportHeader.propTypes = {
  organizationName: PropTypes.string,
  classes: PropTypes.object,
};

const styles = theme => ({
  orgName: {
    textAlign: "center",
    fontSize: "2em",
    fontWeight: "200",
    margin: "1em 0 .25em",
  },
  reportName: {
    textAlign: "center",
    fontSize: "1.5em",
    fontWeight: "500",
    margin: ".25em 0 1rem",
  },
});

export default withStyles(styles)(ReportHeader);
