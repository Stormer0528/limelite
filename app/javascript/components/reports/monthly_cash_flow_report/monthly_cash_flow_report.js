import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core/styles";

// Components
import Breadcrumb from "./breadcrumb";
import ReportPeriodControl from "../shared/report_period_control";
import EntrySelector from "../shared/entry_selector";
import TopBar from "../shared/top_bar";
import ReportTable from "./report_table";
import ReportHeader from "./report_header";
import ReportFooter from "../shared/report_footer";
import ValidationErrors from "../../shared/validation_errors";

const MonthlyCashFlowReport = ({
  reportPeriod,
  startDate,
  endDate,
  organizationName,
  xlsxUrl,
  pdfUrl,
  account = {},
  colspanWidth = 0,
  months = [],
  monthTitles = [],
  cashAtBeginning = [],
  cashAtEnd = [],
  financingActivities = [],
  financingActivitiesTotal = [],
  fiscalYear,
  investigatingActivities = [],
  investingActivities = [],
  investingActivitiesTotal = [],
  netCash = [],
  netCashIncrease = [],
  netIncome = [],
  netOperationsCash = [],
  otherIncome = [],
  otherIncomeTotal = [],
  ui = {},
  errors = [],
  valid,
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
  classes = {},
}) => {
  return (
    <section
      className={`MonthlyCashFlowReport react-inputs ${classes.container}`}
    >
      <Breadcrumb />
      <TopBar
        {...{
          pdfPath: pdfUrl,
          xlsxPath: xlsxUrl,
          handleSaveClick,
          handleExportClick,
          handleRunReportClick,
          valid,
          persisted: true,
          ...ui,
        }}
      />

      {errors.length > 0 && <ValidationErrors errors={errors} />}

      <div
        style={{
          margin: "0 0 15px",
          height: "1px",
        }}
      />
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

      <ReportHeader {...{startDate, endDate, organizationName}} />

      <ReportTable
        {...{
          months,
          monthTitles,
          colspanWidth,
          cashAtBeginning,
          cashAtEnd,
          financingActivities,
          financingActivitiesTotal,
          fiscalYear,
          investigatingActivities,
          investingActivities,
          investingActivitiesTotal,
          netCash,
          netCashIncrease,
          netIncome,
          netOperationsCash,
          otherIncome,
          otherIncomeTotal,
        }}
      />
      <ReportFooter />
    </section>
  );
};

MonthlyCashFlowReport.propTypes = {
  classes: PropTypes.object,
  reportPeriod: PropTypes.string,
  errors: PropTypes.array,
  valid: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  persisted: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  organizationName: PropTypes.string,
  startDate: PropTypes.string,
  endDate: PropTypes.string,
  notes: PropTypes.string,
  account: PropTypes.shape({
    fundCode: PropTypes.string,
    resourceCode: PropTypes.string,
    yearCode: PropTypes.string,
    goalCode: PropTypes.string,
    functionCode: PropTypes.string,
    objectCode: PropTypes.string,
    locationCode: PropTypes.string,
  }),
  colspanWidth: PropTypes.number,
  months: PropTypes.arrayOf(PropTypes.string),
  monthTitles: PropTypes.arrayOf(PropTypes.string),
  cashAtBeginning: PropTypes.array,
  cashAtEnd: PropTypes.array,
  financingActivities: PropTypes.array,
  financingActivitiesTotal: PropTypes.array,
  fiscalYear: PropTypes.string,
  investigatingActivities: PropTypes.array,
  investingActivities: PropTypes.array,
  investingActivitiesTotal: PropTypes.array,
  netCash: PropTypes.array,
  netCashIncrease: PropTypes.array,
  netIncome: PropTypes.array,
  netOperationsCash: PropTypes.array,
  otherIncome: PropTypes.array,
  otherIncomeTotal: PropTypes.array,
  ui: PropTypes.object,
  pdfUrl: PropTypes.string,
  xlsxUrl: PropTypes.string,
  /*  callbacks  */
  handleDateSelectorChange: PropTypes.func.isRequired,
  handleStartDateChange: PropTypes.func.isRequired,
  handleEndDateChange: PropTypes.func.isRequired,
  handleAccountFundChange: PropTypes.func.isRequired,
  handleAccountResourceChange: PropTypes.func.isRequired,
  handleAccountYearChange: PropTypes.func.isRequired,
  handleAccountGoalChange: PropTypes.func.isRequired,
  handleAccountFunctionChange: PropTypes.func.isRequired,
  handleAccountObjectChange: PropTypes.func.isRequired,
  handleAccountLocationChange: PropTypes.func.isRequired,
  handleSaveClick: PropTypes.func.isRequired,
  handleExportClick: PropTypes.func.isRequired,
  handleRunReportClick: PropTypes.func.isRequired,
};

const styles = (theme) => ({
  container: {
    marginTop: "115px",
  },
});

// Export
//------------------------------------------------------------------------------
export default withStyles(styles)(MonthlyCashFlowReport);
