import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core/styles";
import ReportHeader from "./report_header";
import ReportPeriodControl from "./report_period_control";
import TopBar from "../shared/top_bar";
import ReportTable from "./report_table";
import ValidationErrors from "../../shared/validation_errors";
import Breadcrumb from "./breadcrumb";

// Components
//------------------------------------------------------------------------------
const ApAgingReport = ({
  reportPeriod,
  startDate,
  endDate,
  pdfUrl,
  xlsxUrl,
  ui = {},
  errors = [],
  valid,
  persisted,
  periodNames = [],
  periodsByVendor = {},
  vendorsByPeriod = {},
  showActiveRows,
  showActiveColumns,
  /*  callbacks  */
  handleDateSelectorChange = function () {},
  handleStartDateChange = function () {},
  handleEndDateChange = function () {},
  handleExportClick = function () {},
  handleRunReportClick = function () {},
  classes = {},
}) => {
  return (
    <section className={`ApAgingReport ${classes.container}`}>
      <Breadcrumb />
      <TopBar
        {...{
          pdfPath: pdfUrl,
          xlsxPath: xlsxUrl,
          handleExportClick,
          handleRunReportClick,
          valid,
          persisted,
          ...ui,
        }}
      />

      {errors.length > 0 && <ValidationErrors errors={errors} />}

      <ReportHeader {...{startDate, endDate}} />
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
      <hr style={{margin: ".25em 0", borderColor: "#f5f5f525"}} />
      <ReportTable
        {...{
          periodNames,
          periodsByVendor,
          vendorsByPeriod,
          showActiveRows,
          showActiveColumns,
        }}
      />
    </section>
  );
};

ApAgingReport.propTypes = {
  reportPeriod: PropTypes.string,
  pdfUrl: PropTypes.string,
  xlsxUrl: PropTypes.string,
  ui: PropTypes.object,
  errors: PropTypes.arrayOf(PropTypes.string),
  valid: PropTypes.bool,
  persisted: PropTypes.bool,
  updated_at: PropTypes.string,
  periodsByVendor: PropTypes.object,
  vendorsByPeriod: PropTypes.object,
  startDate: PropTypes.string,
  endDate: PropTypes.string,
  showActiveRows: PropTypes.bool,
  showActiveColumns: PropTypes.bool,
  periodNames: PropTypes.arrayOf(PropTypes.string),

  handleDateSelectorChange: PropTypes.func.isRequired,
  handleStartDateChange: PropTypes.func.isRequired,
  handleEndDateChange: PropTypes.func.isRequired,
  handleExportClick: PropTypes.func.isRequired,
  handleRunReportClick: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};

const styles = (theme) => ({
  container: {
    marginTop: "115px",
    display: "flex",
    flexDirection: "column",
    height: "calc(100vh - 115px - 1em)",
  },
});

// Export
//------------------------------------------------------------------------------
export default withStyles(styles)(ApAgingReport);
