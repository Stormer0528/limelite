import {useState} from "react";
import find from "lodash/find";
import PropTypes from "prop-types";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Paper from "@material-ui/core/Paper";

import ReportTable from "./report_table";

import {withStyles} from "@material-ui/core/styles";

const ReportTabs = props => {
  const {reports = [], accountFund = [], classes = {}} = props;
  const [value, setValue] = useState("total");

  function handleChange(event, newValue) {
    setValue(newValue);
  }
  const reportValue =
    find(reports, ({fund: {code}}) => {
      return code === value;
    }) || {};

  return (
    <Paper className={classes.root}>
      <Tabs variant="fullWidth" value={value} onChange={handleChange}>
        <Tab key={"total"} value={"total"} label="All Funds" />
        {accountFund.map(({name, code}) => (
          <Tab key={code} value={code} label={`${code} - ${name}`} />
        ))}
      </Tabs>
      <ReportTable {...reportValue} />
    </Paper>
  );
};

ReportTabs.propTypes = {
  reports: PropTypes.arrayOf(PropTypes.object),
  accountFund: PropTypes.arrayOf(PropTypes.object),
  classes: PropTypes.object.isRequired,
};

const styles = theme => ({
  root: {
    overflow: "auto",
  },
});

export default withStyles(styles)(ReportTabs);
