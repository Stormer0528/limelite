import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core/styles";

// Components
import ReportHeader from "./report_header";
import ReportPeriodControl from "../shared/report_period_control";
import TopBar from "../shared/top_bar";
import EntrySelector from "../shared/entry_selector_container";
import ReportTable from "./report_table";
import ReportFooter from "../shared/report_footer";
import ValidationErrors from "../../shared/validation_errors";
import Breadcrumb from "./breadcrumb";

import Divider from "@material-ui/core/Divider";

const ProfitAndLossStatement = ({
  reportPeriod,
  startDate,
  endDate,
  pdf_url: pdfPath,
  xlsx_url: xlsxPath,
  data = {},
  ui = {},
  errors = [],
  valid,
  persisted,
  organizationName,
  accountFundCode,
  accountFundName,
  account,
  updated_at,
  colspanWidth,
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
  createBudgetLinkHandler = function () {},
  classes = {},
}) => {
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
          startDate,
          endDate,
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
      <ReportTable
        {...data}
        {...{
          colspanWidth,
          accountFundCode,
          accountFundName,
          createLinkHandler,
          createBudgetLinkHandler,
        }}
      />
      <ReportFooter />
    </section>
  );
};

ProfitAndLossStatement.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
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
  colspanWidth: PropTypes.number,
  /*  callbacks  */
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
  createBudgetLinkHandler: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};

const styles = (theme) => ({
  container: {
    marginTop: "115px",
  },
});

// Export
//------------------------------------------------------------------------------
export default withStyles(styles)(ProfitAndLossStatement);
