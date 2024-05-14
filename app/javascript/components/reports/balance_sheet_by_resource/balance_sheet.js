import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core/styles";

import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

// Components
import ReportHeader from "./report_header";
import ReportPeriodControl from "../shared/report_period_control";
import TopBar from "../shared/updated_top_bar";
import EntrySelector from "../shared/entry_selector";
import ReportTable from "./report_table";
import ValidationErrors from "../../shared/validation_errors";
import Breadcrumb from "./breadcrumb";

import Divider from "@material-ui/core/Divider";

const BalanceSheetReport = ({
  loading = false,
  dirty = false,
  startDate: initialStartDate,
  endDate: initialEndDate,
  fund_code: fundCode = "",
  function_code: functionCode = "",
  goal_code: goalCode = "",
  location_code: locationCode = "",
  object_code: objectCode = "",
  resource_code: resourceCode = "",
  year_code: yearCode = "",
  values: {startDate, endDate, account = {}},
  pdfUrl,
  xlsxUrl,
  data = {reports: {all: {}}},
  errors = [],
  organizationName,
  accountFundCode,
  accountFundName,
  updatedAt,
  resourceTitles = [],
  /*  callbacks  */
  handleChange = function () {},
  handleSubmit = function () {},
  createLinkHandler = function () {},
  tabIndex = "all",
  handleTabClick = function () {},
  classes = {},
}) => {
  const handleStartDateChange = (value) =>
    handleChange({
      target: {name: "startDate", value},
    });

  const handleEndtDateChange = (value) =>
    handleChange({
      target: {name: "endDate", value},
    });

  const report = (data.reports || {})[tabIndex] || {};

  return (
    <section className={`BalanceSheetReport react-inputs ${classes.container}`}>
      <Breadcrumb />
      <TopBar
        {...{
          xlsxPath: xlsxUrl,
          pdfPath: pdfUrl,
          handleRunClick: handleSubmit,
          loading,
          dirty,
        }}
      />
      {errors.length > 0 && <ValidationErrors errors={errors} />}
      <ReportHeader
        {...{
          organizationName,
          startDate: startDate || initialStartDate,
          endDate: endDate || initialEndDate,
          updatedAt,
          accountFundCode,
          accountFundName,
        }}
      />
      <Divider />
      <ReportPeriodControl
        hideStartDate
        dateRangeTitle="Balance As Of:"
        {...{
          startDate: startDate || initialStartDate,
          endDate: endDate || initialEndDate,
          handleDateSelectorChange: handleChange,
          handleStartDateChange: handleStartDateChange,
          handleEndDateChange: handleEndtDateChange,
        }}
      />
      <EntrySelector
        showHelp
        {...{
          fundCode,
          functionCode,
          goalCode,
          locationCode,
          objectCode,
          resourceCode,
          yearCode,
          ...account,
          handleAccountFundChange: handleChange,
          handleAccountResourceChange: handleChange,
          handleAccountYearChange: handleChange,
          handleAccountGoalChange: handleChange,
          handleAccountFunctionChange: handleChange,
          handleAccountObjectChange: handleChange,
          handleAccountLocationChange: handleChange,
        }}
      />

      {Object.keys(data.reports || {}).length > 1 && (
        <Tabs
          value={tabIndex}
          onChange={handleTabClick}
          indicatorColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          className={classes.tabs}
        >
          {Object.keys(data.reports || {}).map((fund, i) => {
            return <Tab label={fund} value={fund} key={fund + i} />;
          })}
        </Tabs>
      )}

      <ReportTable
        {...report}
        {...{
          resourceTitles,
          accountFundCode,
          accountFundName,
          createLinkHandler,
        }}
      />
    </section>
  );
};

BalanceSheetReport.propTypes = {
  reportPeriod: PropTypes.string,
  startDate: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  endDate: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  accountFundCode: PropTypes.string,
  accountFundName: PropTypes.string,
  data: PropTypes.object,
  pdfUrl: PropTypes.string,
  xlsxUrl: PropTypes.string,
  errors: PropTypes.array,
  organizationName: PropTypes.string,
  account: PropTypes.object,
  updatedAt: PropTypes.string,
  classes: PropTypes.object.isRequired,
  loading: PropTypes.bool,
  dirty: PropTypes.bool,
  fund_code: PropTypes.string,
  function_code: PropTypes.string,
  goal_code: PropTypes.string,
  location_code: PropTypes.string,
  object_code: PropTypes.string,
  resource_code: PropTypes.string,
  year_code: PropTypes.string,
  values: PropTypes.shape({
    startDate: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    endDate: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    account: PropTypes.object,
  }),
  resourceTitles: PropTypes.arrayOf(PropTypes.string),
  /*  callbacks  */
  handleChange: PropTypes.func,
  handleSubmit: PropTypes.func,
  createLinkHandler: PropTypes.func,
  tabIndex: PropTypes.func,
  setTabIndex: PropTypes.func,
  handleTabClick: PropTypes.func,
};

const styles = (theme) => ({
  container: {
    marginTop: "115px",
  },
  tabs: {
    background: "#f5f5f5",
    marginBottom: "1rem",
    borderBottom: "1px solid #cfd8dc",

    "& button:focus": {
      backgroundColor: "#B0BEC5",
    },
  },
});

// Export
//------------------------------------------------------------------------------
export default withStyles(styles)(BalanceSheetReport);
