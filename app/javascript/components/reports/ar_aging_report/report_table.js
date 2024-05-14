import {useState} from "react";
import PropTypes from "prop-types";

import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Paper from "@material-ui/core/Paper";

import {withStyles} from "@material-ui/core/styles";
import PeriodsByCustomer from "./periods_by_customer";
import CustomersByPeriod from "./customers_by_period";

const ReportTable = ({
  periodNames = [],
  periodsByCustomer = {},
  customersByPeriod = {},
  showActiveRows,
  showActiveColumns,
  classes = {},
}) => {
  const [value, setValue] = useState(0);
  function handleChange(event, newValue) {
    setValue(newValue);
  }

  return (
    <Paper className={classes.root}>
      <AppBar position="static">
        <Tabs
          value={value}
          onChange={handleChange}
          variant="fullWidth"
          classes={{indicator: classes.tabIndicator}}
        >
          <Tab
            label="AR AGING SUMMARY"
            classes={{root: classes.tabRoot, selected: classes.tabSelected}}
          />
          <Tab
            label="AR AGING DETAIL"
            classes={{root: classes.tabRoot, selected: classes.tabSelected}}
          />
        </Tabs>
      </AppBar>
      {value === 0 && (
        <PeriodsByCustomer
          {...{periodNames, periodsByCustomer, showActiveColumns}}
        />
      )}
      {value === 1 && (
        <CustomersByPeriod
          {...{periodNames, customersByPeriod, showActiveRows}}
        />
      )}
    </Paper>
  );
};

ReportTable.propTypes = {
  periodNames: PropTypes.arrayOf(PropTypes.string),
  periodsByCustomer: PropTypes.object,
  customersByPeriod: PropTypes.object,
  showActiveRows: PropTypes.bool,
  showActiveColumns: PropTypes.bool,

  classes: PropTypes.object.isRequired,
};

const styles = theme => ({
  root: {
    minHeight: "250px",
    flexGrow: 1,
    overflow: "auto",
    display: "flex",
    flexDirection: "column",
  },
  tabRoot: {
    "&:focus": {
      backgroundColor: "#455A64",
    },
  },
  tabSelected: {
    backgroundColor: "#455A64",
  },
  tabIndicator: {
    backgroundColor: "#ffa000c4",
    borderRadius: "25%",
  },
  currencyCell: {
    textAlign: "right",
  },
});

export default withStyles(styles)(ReportTable);
