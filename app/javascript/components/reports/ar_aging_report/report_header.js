import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core/styles";
import {format} from "date-fns/esm";

const ReportHeader = ({startDate, endDate, classes = {}}) => {
  return (
    <header className={`${classes.root}`}>
      <div className={classes.headerContainer}>
        <h3 className={classes.header}>A/R Aging Report</h3>
      </div>
      <div style={{marginRight: "1em"}}>
        <b>Start Date:&nbsp;</b>
        {format(startDate, "MM/dd/yyyy")}
      </div>
      <div>
        <b>End Date:&nbsp;</b>
        {format(endDate, "MM/dd/yyyy")}
      </div>
    </header>
  );
};

ReportHeader.propTypes = {
  startDate: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(Date),
  ]),
  endDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  classes: PropTypes.object,
};

const styles = theme => ({
  root: {
    display: "flex",
    alignItems: "baseline",
    margin: "0 0 .75rem",
  },
  headerContainer: {
    flexGrow: 1,
    marginRight: "1em",
  },
  header: {
    fontSize: "2.125em",
    fontWeight: "300",
    margin: ".5em 0 .25em",
  },
});

export default withStyles(styles)(ReportHeader);
