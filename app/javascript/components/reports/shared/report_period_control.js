import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core/styles";
import KeyboardDate from "../shared/keyboard_date";
// Material UI
import Grid from "@material-ui/core/Grid";
import DateSelector from "./date_selector";

const ReportPeriodControl = ({
  reportPeriod,
  startDate = null,
  endDate = null,
  classes = {},
  startDateProps = {},
  endDateProps = {},
  dateSelectorProps = {},
  hideStartDate = false,
  hideEndDate = false,
  dateRangeTitle = "Date Range:",
  /* callbacks */
  handleDateSelectorChange = function () {},
  handleEndDateChange = function () {},
  handleStartDateChange = function () {},
}) => {
  return (
    <Grid
      container
      className={`${classes.container} react-inputs`}
      spacing={1}
      alignItems="baseline"
      justifyContent="space-around"
      wrap="nowrap"
    >
      <Grid item>
        <b>{dateRangeTitle}</b>
      </Grid>
      <Grid item>
        <DateSelector
          handleValueChange={handleDateSelectorChange}
          {...{
            value: reportPeriod,
            handleStartDateChange,
            handleEndDateChange,
            ...dateSelectorProps,
          }}
        />
      </Grid>
      {!hideEndDate && !hideStartDate && (
        <Grid item className={classes.textLabel}>
          from
        </Grid>
      )}
      {!hideStartDate && (
        <Grid item>
          <KeyboardDate
            autoOk
            variant="inline"
            name="startDate"
            label=""
            helperText="Start Date"
            value={startDate}
            onChange={handleStartDateChange}
            {...startDateProps}
          />
        </Grid>
      )}
      {!hideEndDate && !hideStartDate && (
        <Grid item className={classes.textLabel}>
          to
        </Grid>
      )}
      {!hideEndDate && (
        <Grid item>
          <KeyboardDate
            autoOk
            variant="inline"
            name="endDate"
            helperText="End Date"
            label=""
            value={endDate}
            onChange={handleEndDateChange}
            {...endDateProps}
          />
        </Grid>
      )}
    </Grid>
  );
};

ReportPeriodControl.propTypes = {
  reportPeriod: PropTypes.string,
  startDate: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
    PropTypes.object,
    PropTypes.instanceOf(Date),
  ]),
  endDate: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.instanceOf(Date),
  ]),
  startDateProps: PropTypes.object,
  endDateProps: PropTypes.object,
  dateSelectorProps: PropTypes.object,
  classes: PropTypes.object,
  hideStartDate: PropTypes.bool,
  hideEndDate: PropTypes.bool,
  dateRangeTitle: PropTypes.string,
  /* callbacks  */
  handleDateSelectorChange: PropTypes.func,
  handleEndDateChange: PropTypes.func.isRequired,
  handleStartDateChange: PropTypes.func.isRequired,
};

const styles = () => ({
  container: {
    backgroundColor: "#f5f5f5",
    marginBottom: "1em",
    display: "grid",
    gridTemplateColumns: "repeat(6, max-content)",
    justifyContent: "center",
    gridColumnGap: "1rem",
    paddingLeft: "1rem",
  },
  gridItem: {
    flexGrow: 1,
    marginRight: ".75rem",
  },
  searchContainer: {
    padding: 0,
  },
  textLabel: {
    fontSize: "1.15em",
    padding: "0 .75em",
    fontWeight: "300",
  },
  menuButton: {
    "&:focus": {
      backgroundColor: "transparent",
    },
  },
});

export default withStyles(styles)(ReportPeriodControl);
