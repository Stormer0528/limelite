import {connect} from "react-redux";
import {compose} from "redux";
import DateWrapper from "../../shared/date_wrapper";
import ThemeWrapper from "../../shared/theme_wrapper";
import {lifecycle} from "recompose";

import Vendor1099Report from "./vendor_1099_report";

// Redux
//------------------------------------------------------------------------------
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
    handleSaveClick: () => {
      dispatch({type: "RUN_VENDOR_1099_REPORT"});
    },
    handleExportClick: () => {
      setExportModalOpen();
    },
    handleRunReportClick: () => {
      dispatch({type: "RUN_VENDOR_1099_REPORT"});
    },
    loadReport: () => {
      dispatch({type: "LOAD_VENDOR_1099_REPORT"});
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
)(Vendor1099Report);
