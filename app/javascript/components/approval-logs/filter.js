import ReportPeriodControl from "../reports/shared/report_period_control";
import OrgSelector from "./org_selector";
import Grid from "@material-ui/core/Grid";
import Toolbar from "@material-ui/core/Toolbar";
import {withStyles} from "@material-ui/core/styles";
import PropTypes from "prop-types";
import {useCallback} from "react";
import {useQuery} from "react-apollo";

const LogFilter = ({
  classes = {},
  filter: {reportPeriod, startDate, endDate, organizationId},
  setFilter,
  organizations = [],
}) => {
  const handleDateSelectorChange = useCallback((value) => {
    setFilter((filter) => ({
      ...filter,
      reportPeriod: value,
    }));
  }, []);

  const handleStartDateChange = useCallback((value) => {
    setFilter((filter) => ({
      ...filter,
      startDate: value,
    }));
  }, []);

  const handleEndDateChange = useCallback((value) => {
    setFilter((filter) => ({
      ...filter,
      endDate: value,
    }));
  }, []);

  const handleOrganizationChange = useCallback((e) => {
    setFilter((filter) => ({
      ...filter,
      organizationId: e.target.value,
    }));
  });

  return (
    <Toolbar className={classes.root}>
      <Grid
        container
        className={classes.container}
        spacing={1}
        alignItems="stretch"
        alignContent="space-around"
        justifyContent="center"
        wrap="nowrap"
      >
        <Grid item className={classes.reportPeriods} xs={6} sm={6}>
          <ReportPeriodControl
            hideStartDate
            {...{
              reportPeriod,
              startDate,
              endDate,
              handleDateSelectorChange,
              handleStartDateChange,
              handleEndDateChange,
            }}
          />
        </Grid>
        <Grid item xs />

        <Grid item sm={3}>
          <OrgSelector
            setCurrentOrg={handleOrganizationChange}
            organizationId={organizationId}
            organizations={organizations}
          />
        </Grid>
      </Grid>
    </Toolbar>
  );
};

LogFilter.propTypes = {
  classes: PropTypes.object,
  filter: PropTypes.object,
  setFilter: PropTypes.func,
};

const styles = (theme) => ({
  container: {
    alignItems: "center",
    justifyContent: "flex-start",
    padding: `4px ${theme.spacing(2)}px`,
  },
  reportPeriods: {
    "& > div": {
      backgroundColor: "white",
      margin: "auto",
    },
  },
  root: {
    padding: 0,
    background: "#fcfcfc",
  },
});

export default withStyles(styles)(LogFilter);
