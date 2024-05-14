import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core/styles";
import {format} from "date-fns/esm";

const ReportTable = ({organizationName, startDate, endDate, classes = {}}) => {
  return (
    <div className={classes.root}>
      <h2 className={classes.orgName}>{organizationName}</h2>
      <h3 className={classes.subtitle}>Monthly Statement of Cash Flows</h3>
      <h4 className={classes.dates}>
        {format(startDate, "MM/dd/yyyy")} &ndash;{" "}
        {format(endDate, "MM/dd/yyyy")}
      </h4>
    </div>
  );
};

ReportTable.propTypes = {
  organizationName: PropTypes.string,
  startDate: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(Date),
  ]),
  endDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  classes: PropTypes.object.isRequired,
};

const styles = theme => ({
  root: {
    margin: "1em 0 1em 0",
  },
  orgName: {
    fontSize: "1.5em",
    margin: " 0 0 0.25em",
  },
  subtitle: {
    fontSize: "1.25em",
    margin: "0 0 0.25em",
    fontWeight: 300,
  },
  dates: {
    fontSize: "1.0125em",
    margin: "0 0 1em",
    fontWeight: 100,
  },
});

export default withStyles(styles)(ReportTable);
