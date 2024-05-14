import {connect} from "react-redux";
import {compose} from "redux";
import {lifecycle} from "recompose";
import DateWrapper from "../../shared/date_wrapper";
import ThemeWrapper from "../../shared/theme_wrapper";

import ComparativeProfitAndLossStatement from './comparative_profit_and_loss_statement';

// Redux
//------------------------------------------------------------------------------
const mapStateToProps = ({
  report,
  report: {data, startDate, endDate, account},
}) => {
  const createLinkHandler = (objectCode) => () => {
    const printPath = `/entries?startDate=${encodeURIComponent(
      startDate
    )}&endDate=${encodeURIComponent(endDate)}&account=${encodeURIComponent(
      JSON.stringify(Object.assign({}, account, {objectCode}))
    )}`;
    window.open(printPath);
  };

  return {
    ...report,
    data,
    createLinkHandler,
  };
};

const mapDispatchToProps = (dispatch) => {
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
    handleDateSelectorChange: (value) => {
      setReportPeriod(value);
    },

    handleStartDateChange: (date) => {
      setStartDate(date);
    },

    handleEndDateChange: (date) => {
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
      dispatch({type: "RUN_COMPARATIVE_PROFIT_AND_LOSS_REPORT"});
    },
    handleExportClick: () => {
      setExportModalOpen();
    },
    handleRunReportClick: () => {
      dispatch({type: "RUN_COMPARATIVE_PROFIT_AND_LOSS_REPORT"});
    },
    loadReport: () => {
      dispatch({type: "LOAD_COMPARATIVE_PROFIT_AND_LOSS_REPORT"});
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
)(ComparativeProfitAndLossStatement);
