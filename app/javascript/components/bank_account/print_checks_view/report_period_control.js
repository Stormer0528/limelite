import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core/styles";

// Material UI
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import SearchIcon from "@material-ui/icons/Search";

import DatePicker from "../../page_elements/date_input_base";
import DateSelector from "../../reports/shared/date_selector";

import toDate from "date-fns/toDate";

const ReportPeriodControl = ({
  reportPeriod,
  startDate = null,
  endDate = null,
  classes = {},
  startDateProps = {},
  endDateProps = {},
  dateSelectorProps = {},
  /* callbacks */
  handleSubmit = function () {},
  handleDateSelectorChange = function () {},
  handleEndDateChange = function () {},
  handleStartDateChange = function () {},
}) => {
  const onClick = async () => {
    await handleSubmit({variables: {startDate, endDate}});
  };
  return (
    <Grid
      container
      className={`${classes.container} react-inputs`}
      spacing={2}
      justify="space-around"
      wrap="nowrap"
    >
      <Grid item>
        <b>Date Range:</b>
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
      <Grid item className={classes.textLabel}>
        from
      </Grid>
      <Grid item>
        <DatePicker
          value={toDate(startDate)}
          onChange={handleStartDateChange}
          label=""
          helperText="Start Date"
          name="startDate"
          {...startDateProps}
        />
      </Grid>
      <Grid item className={classes.textLabel}>
        to
      </Grid>
      <Grid item>
        <DatePicker
          value={toDate(endDate)}
          onChange={handleEndDateChange}
          label=""
          name="endDate"
          helperText="End Date"
          {...endDateProps}
        />
      </Grid>
      <Grid item className={classes.searchBtnCell}>
        <Button variant="outlined" onClick={onClick}>
          <SearchIcon />
          &nbsp;Find&nbsp;Checks
        </Button>
      </Grid>
    </Grid>
  );
};

ReportPeriodControl.propTypes = {
  reportPeriod: PropTypes.string,
  startDate: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
    PropTypes.instanceOf(Date),
  ]),
  endDate: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
    PropTypes.instanceOf(Date),
  ]),
  handleSubmit: PropTypes.func,
  startDateProps: PropTypes.object,
  endDateProps: PropTypes.object,
  dateSelectorProps: PropTypes.object,
  classes: PropTypes.object,
  /* callbacks  */
  handleDateSelectorChange: PropTypes.func,
  handleEndDateChange: PropTypes.func.isRequired,
  handleStartDateChange: PropTypes.func.isRequired,
};

const styles = (theme) => ({
  container: {
    borderTop: "#eee",
    backgroundColor: "#f5f5f5",
    margin: "0 -1rem -1rem",
    width: "calc(100% + 2rem)",
    display: "grid",
    gridTemplateColumns: "7.5em 10em 4em 12.5em 3em 12.5em 1fr",
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
  searchBtnCell: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-end",
    height: "100%",
    flexGrow: "1",
  },
});

export default withStyles(styles)(ReportPeriodControl);
