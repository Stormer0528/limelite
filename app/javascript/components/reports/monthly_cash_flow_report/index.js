import {connect} from "react-redux";
import {compose} from "redux";
import {lifecycle} from "recompose";
import DateWrapper from "../../shared/date_wrapper";
import ThemeWrapper from "../../shared/theme_wrapper";

import CashFlowReport from "./monthly_cash_flow_report";

// Redux
//------------------------------------------------------------------------------
const mapStateToProps = ({report}) => {
  return {
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
    handleSaveClick: () => {
      dispatch({type: "RUN_MONTHLY_CASH_FLOW_REPORT"});
    },
    handleExportClick: () => {
      setExportModalOpen();
    },
    handleRunReportClick: () => {
      dispatch({type: "RUN_MONTHLY_CASH_FLOW_REPORT"});
    },
    loadReport: () => {
      dispatch({type: "LOAD_MONTHLY_CASH_FLOW_REPORT"});
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
