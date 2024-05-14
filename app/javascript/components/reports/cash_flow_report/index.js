import {connect} from "react-redux";
import {compose} from "redux";
// import {formatNumber} from "humanize-plus";
import {lifecycle} from "recompose";
import DateWrapper from "../../shared/date_wrapper";
import ThemeWrapper from "../../shared/theme_wrapper";

import CashFlowReport from "./cash_flow_report";

// Redux
//------------------------------------------------------------------------------
const mapStateToProps = ({report}) => {
  return {
    report,
    ...report,
  };
};

const mapDispatchToProps = dispatch => {
  const {
    report: {
      setReportPeriod,
      setStartDate,
      setEndDate,
      setAccountFund,
      setAccountResource,
      setAccountYear,
      setAccountGoal,
      setAccountFunction,
      setAccountObject,
      setAccountLocation,
      setExportModalOpen,
    },
  } = dispatch;

  return {
    handleDateSelectorChange: value => {
      setReportPeriod(value);
    },
    handleStartDateChange: date => {
      setStartDate(date);
    },
    handleEndDateChange: date => {
      setEndDate(date);
    },
    handleAccountFundChange: ({target: {value}}) => {
      setAccountFund(value);
    },
    handleAccountResourceChange: ({target: {value}}) => {
      setAccountResource(value);
    },
    handleAccountYearChange: ({target: {value}}) => {
      setAccountYear(value);
    },
    handleAccountGoalChange: ({target: {value}}) => {
      setAccountGoal(value);
    },
    handleAccountFunctionChange: ({target: {value}}) => {
      setAccountFunction(value);
    },
    handleAccountObjectChange: ({target: {value}}) => {
      setAccountObject(value);
    },
    handleAccountLocationChange: ({target: {value}}) => {
      setAccountLocation(value);
    },
    handleExportClick: () => {
      setExportModalOpen();
    },
    handleRunReportClick: () => {
      dispatch({type: "RUN_CASH_FLOW_REPORT"});
    },
    loadReport: () => {
      dispatch({type: "LOAD_CASH_FLOW_REPORT"});
    },
  };
};

// Export
//------------------------------------------------------------------------------
export default compose(
  ThemeWrapper,
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  DateWrapper,
  lifecycle({
    componentDidMount() {
      this.props.loadReport();
    },
  })
)(CashFlowReport);
