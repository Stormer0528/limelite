import {connect} from "react-redux";
import {compose} from "redux";
import DateWrapper from "../../shared/date_wrapper";
import ThemeWrapper from "../../shared/theme_wrapper";
import {lifecycle} from "recompose";
// Components
import ApAgingReport from "./ap_aging_report";

const mapStateToProps = ({report}) => {
  return {...report};
};

const mapDispatchToProps = (dispatch) => {
  const {
    report: {setReportPeriod, setStartDate, setEndDate, setExportModalOpen},
  } = dispatch;
  return {
    handleDateSelectorChange: (value) => {
      setReportPeriod(value);
    },
    handleStartDateChange: (date) => {
      setStartDate(date);
    },
    handleEndDateChange: (date) => {
      setEndDate(date);
    },
    handleRunReportClick: () => {
      dispatch({type: "RUN_AP_AGING_REPORT"});
    },
    handleExportClick: () => {
      setExportModalOpen();
    },
    loadReport: () => {
      dispatch({type: "LOAD_AP_AGING_REPORT"});
    },
  };
};

// Export
//------------------------------------------------------------------------------
export default compose(
  ThemeWrapper,
  connect(mapStateToProps, mapDispatchToProps),
  DateWrapper,
  lifecycle({
    componentDidMount() {
      this.props.loadReport();
    },
  })
)(ApAgingReport);
