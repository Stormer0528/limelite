import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core/styles";

// Components
import ReportHeader from "./report_header";
import ReportPeriodControl from "../shared/report_period_control";
import TopBar from "../shared/top_bar";
import ReportTable from "./report_table";
import ReportFooter from "../shared/report_footer";
import ValidationErrors from "../../shared/validation_errors";
import Breadcrumb from "./breadcrumb";

import Divider from "@material-ui/core/Divider";

const VendorReport = ({
  organizationName,
  reportPeriod,
  startDate,
  endDate,
  pdfUrl,
  xlsxUrl,
  ui = {},
  errors = [],
  vendors = [],
  valid,
  persisted,
  updated_at,
  /*  callbacks  */
  handleDateSelectorChange = function () {},
  handleStartDateChange = function () {},
  handleEndDateChange = function () {},
  handleExportClick = function () {},
  handleRunReportClick = function () {},
  classes = {},
}) => {
  return (
    <section className={`VendorReport react-inputs ${classes.container}`}>
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

      <ReportHeader
        {...{
          organizationName,
          end_date: endDate,
          updated_at,
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

      <ReportTable {...{vendors}} />

      <ReportFooter />
    </section>
  );
};

VendorReport.propTypes = {
  organizationName: PropTypes.string,
  reportPeriod: PropTypes.string,
  startDate: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  endDate: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  vendors: PropTypes.arrayOf(
    PropTypes.shape({
      code: PropTypes.string,
      vendor_name: PropTypes.string,
      vendor_number: PropTypes.string,
      amount: PropTypes.string,
    })
  ),
  ui: PropTypes.object,
  pdfUrl: PropTypes.string,
  xlsxUrl: PropTypes.string,
  errors: PropTypes.array,
  valid: PropTypes.bool,
  persisted: PropTypes.bool,
  updated_at: PropTypes.string,
  /*  callbacks  */
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
export default withStyles(styles)(VendorReport);
