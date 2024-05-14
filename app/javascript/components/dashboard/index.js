import React, {useEffect} from "react";
import PropTypes from "prop-types";
import {makeStyles /*withStyles*/} from "@material-ui/core/styles";

import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";

import KeyMetrics from "./key_metrics";
import CashBalance from "./cash_balance";
import Revenue from "./revenue";
import Expenses from "./expenses";
import GrantsTable from "./grants_table";
import {useQuery} from "@apollo/react-hooks";
import DASHBOARD_QUERY from "../../graphql/queries/dashboard.gql";

export default function VerticalTabs() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const elem = document.getElementById("top-navbar");
  const currentYear = new Date().getFullYear();

  let {fiscalYear = `${currentYear}`} = elem.dataset;
  fiscalYear = Number(fiscalYear);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const {data: {dashboard = {}} = {}} = useQuery(DASHBOARD_QUERY, {
    variables: {
      startDate: `${fiscalYear}-06-30`,
      endDate: `${fiscalYear + 1}-07-01`,
      fundCode: "",
    },
    fetchPolicy: "network-only",
  });

  if (!dashboard.data) {
    return null;
  }

  const {
    key_metrics: keyMetrics,
    cash_balance: cashBalance,
    revenues,
    expenses,
    grants_table: grantsTable,
  } = JSON.parse(dashboard.data);

  const funds = dashboard.fundCode.split(", ");

  return (
    <Paper className={classes.root}>
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="Vertical tabs example"
        className={classes.tabs}
      >
        <Tab label="Key Metrics" />
        <Tab label="Cash Balance" />
        <Tab label="Revenue" />
        <Tab label="Expenses" />
        <Tab label="Grants Table" />
      </Tabs>
      <TabPanel value={value} index={0}>
        <KeyMetrics data={keyMetrics} accountFunds={funds} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <CashBalance data={cashBalance} accountFunds={funds} />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Revenue data={revenues} accountFunds={funds} />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <Expenses data={expenses} accountFunds={funds} />
      </TabPanel>
      <TabPanel value={value} index={4}>
        <GrantsTable data={grantsTable} accountFunds={funds} />
      </TabPanel>
    </Paper>
  );
}

function TabPanel(props) {
  const {children, value, index, ...other} = props;
  const styles = {width: "100%", overflow: "auto"};
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      style={styles}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: "flex",
    height: 224,
    border: "1px solid #ccc",
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
}));
