import {useState, useCallback} from "react";
import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core/styles";
import uniq from "lodash/uniq";

// Components
import ReportHeader from "./report_header";
import ReportPeriodControl from "../shared/report_period_control";
import TopBar from "../shared/top_bar";
import EntrySelector from "../shared/entry_selector_container";
import ReportTable from "./report_table";
import ReportFooter from "../shared/report_footer";
import ValidationErrors from "../../shared/validation_errors";
import Breadcrumb from "./breadcrumb";

import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Divider from "@material-ui/core/Divider";

const ProfitAndLossStatement = ({
  reportPeriod,
  startDate,
  endDate,
  pdf_url: pdfPath,
  xlsx_url: xlsxPath,
  ui = {},
  errors = [],
  valid,
  persisted,
  organizationName,
  accountFundCode,
  accountFundName,
  account,
  updated_at,
  monthTitles = [],
  months = [],
  colspanWidth = 0,
  data: {reports = {}} = {},
  /*  callbacks  */
  handleDateSelectorChange = function () {},
  handleStartDateChange = function () {},
  handleEndDateChange = function () {},
  handleAccountFundChange = function () {},
  handleAccountResourceChange = function () {},
  handleAccountYearChange = function () {},
  handleAccountGoalChange = function () {},
  handleAccountFunctionChange = function () {},
  handleAccountObjectChange = function () {},
  handleAccountLocationChange = function () {},
  handleSaveClick = function () {},
  handleExportClick = function () {},
  handleRunReportClick = function () {},
  createLinkHandler = function () {},
  classes = {},
}) => {
  const [tabIndex, setTabIndex] = useState("all");
  const handleTabClick = useCallback(
    (e, index) => {
      setTabIndex(index);
    },
    [setTabIndex]
  );
  const report = reports[tabIndex];
  const reportTitles = uniq(["all", ...Object.keys(reports || {})]);

  return (
    <section
      className={`ProfitAndLossStatement react-inputs ${classes.container}`}
    >
      <Breadcrumb />
      <TopBar
        {...{
          pdfPath,
          xlsxPath,
          handleSaveClick,
          handleExportClick,
          handleRunReportClick,
          valid,
          persisted,
          ...ui,
        }}
      />
      {errors.length > 0 && <ValidationErrors errors={errors} />}
      <ReportHeader
        {...{
          organizationName,
          start_date: startDate,
          end_date: endDate,
          updated_at,
          accountFundCode,
          accountFundName,
        }}
      />
      <Divider />
      <ReportPeriodControl
        {...{
          reportPeriod,
          startDate,
          endDate,
          handleDateSelectorChange,
          handleStartDateChange,
          handleEndDateChange,
        }}
      />
      <EntrySelector
        showHelp
        {...{
          ...account,
          handleAccountFundChange,
          handleAccountResourceChange,
          handleAccountYearChange,
          handleAccountGoalChange,
          handleAccountFunctionChange,
          handleAccountObjectChange,
          handleAccountLocationChange,
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
        {...{
          ...report,
          accountFundCode,
          accountFundName,
          monthTitles,
          months,
          colspanWidth,
          createLinkHandler,
        }}
      />

      <ReportFooter />
    </section>
  );
};

ProfitAndLossStatement.propTypes = {
  reportPeriod: PropTypes.string,
  startDate: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  endDate: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  notes: PropTypes.string,
  accountFundCode: PropTypes.string,
  accountFundName: PropTypes.string,
  data: PropTypes.object,
  pdf_url: PropTypes.string,
  xlsx_url: PropTypes.string,
  ui: PropTypes.object,
  errors: PropTypes.array,
  valid: PropTypes.bool,
  persisted: PropTypes.bool,
  organizationName: PropTypes.string,
  account: PropTypes.object,
  updated_at: PropTypes.string,
  monthTitles: PropTypes.array,
  months: PropTypes.array,
  colspanWidth: PropTypes.number,
  tabIndex: PropTypes.string,
  /*  callbacks  */
  handleTabClick: PropTypes.func.isRequired,
  handleDateSelectorChange: PropTypes.func.isRequired,
  handleStartDateChange: PropTypes.func.isRequired,
  handleEndDateChange: PropTypes.func.isRequired,
  handleSaveClick: PropTypes.func.isRequired,
  handleExportClick: PropTypes.func.isRequired,
  handleRunReportClick: PropTypes.func.isRequired,
  handleAccountFundChange: PropTypes.func.isRequired,
  handleAccountResourceChange: PropTypes.func.isRequired,
  handleAccountYearChange: PropTypes.func.isRequired,
  handleAccountGoalChange: PropTypes.func.isRequired,
  handleAccountFunctionChange: PropTypes.func.isRequired,
  handleAccountObjectChange: PropTypes.func.isRequired,
  handleAccountLocationChange: PropTypes.func.isRequired,
  createLinkHandler: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
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
