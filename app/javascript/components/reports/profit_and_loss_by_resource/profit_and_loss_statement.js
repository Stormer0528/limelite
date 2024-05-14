import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core/styles";
import uniq from "lodash/uniq";

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

const ProfitAndLossStatement = ({
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
  xlsxUrl,
  pdfUrl,
  data: {titles = [], reports = []} = {},
  errors = [],
  organizationName,
  accountFundCode,
  accountFundName,
  updated_at,
  resourceTitles = [],
  colspanWidth = 0,
  tabIndex = "all",

  /*  callbacks  */
  handleChange = function () {},
  handleSubmit = function () {},
  handleTabClick = function () {},
  createLinkHandler = () => () => {},
  classes = {},
}) => {
  const handleStartDateChange = (value) =>
    handleChange({
      target: {name: "startDate", value},
    });
  const handleEndDateChange = (value) =>
    handleChange({
      target: {name: "endDate", value},
    });
  const reportTitles = uniq(["all", ...Object.keys(reports || {})]);
  const report = reports[tabIndex] || {};
  if (reports.length === 0) {
    return null;
  }

  return (
    <section
      className={`ProfitAndLossByResource react-inputs ${classes.container}`}
    >
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
          updated_at,
          accountFundCode,
          accountFundName,
        }}
      />
      <Divider />
      <ReportPeriodControl
        {...{
          startDate: startDate || initialStartDate,
          endDate: endDate || initialEndDate,
          handleDateSelectorChange: handleChange,
          handleStartDateChange: handleStartDateChange,
          handleEndDateChange: handleEndDateChange,
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

      {Object.keys(reports || {}).length > 1 && (
        <Tabs
          value={tabIndex}
          onChange={handleTabClick}
          indicatorColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          className={classes.tabs}
        >
          <Tab
            label="Fund"
            value={null}
            disabled
            component="h5"
            className={classes.fundTabLabel}
          />
          {reportTitles.map((fund, i) => {
            return <Tab label={fund} value={fund} key={fund + i} />;
          })}
        </Tabs>
      )}

      <ReportTable
        {...report}
        {...{
          titles,
          accountFundCode,
          accountFundName,
          resourceTitles,
          colspanWidth,
          createLinkHandler,
        }}
      />
    </section>
  );
};

ProfitAndLossStatement.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  reportPeriod: PropTypes.string,
  startDate: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  endDate: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  accountFundCode: PropTypes.string,
  accountFundName: PropTypes.string,
  data: PropTypes.object,
  loading: PropTypes.bool,
  dirty: PropTypes.bool,
  errors: PropTypes.array,
  organizationName: PropTypes.string,
  account: PropTypes.object,
  updated_at: PropTypes.string,
  colspanWidth: PropTypes.number,
  monthTitles: PropTypes.array,
  months: PropTypes.array,
  values: PropTypes.shape({
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    account: PropTypes.object,
  }),
  resourceTitles: PropTypes.arrayOf(PropTypes.string),
  fund_code: PropTypes.string,
  function_code: PropTypes.string,
  goal_code: PropTypes.string,
  location_code: PropTypes.string,
  object_code: PropTypes.string,
  resource_code: PropTypes.string,
  year_code: PropTypes.string,
  pdfUrl: PropTypes.string,
  xlsxUrl: PropTypes.string,
  /*  callbacks  */
  handleChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  tabIndex: PropTypes.string,
  handleTabClick: PropTypes.func.isRequired,
  createLinkHandler: PropTypes.func,
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
  fundTabLabel: {
    margin: 0,
    fontSize: 18,
    textTransform: "capitalize",
    color: "#111",
  },
});

// Export
//------------------------------------------------------------------------------
export default withStyles(styles)(ProfitAndLossStatement);
