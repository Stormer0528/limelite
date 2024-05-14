import {connect} from "react-redux";
import {compose} from "redux";
import {lifecycle} from "recompose";
import DateWrapper from "../../shared/date_wrapper";
import ThemeWrapper from "../../shared/theme_wrapper";

import ProfitAndLossStatement from "./profit_and_loss_statement";

// Redux
//------------------------------------------------------------------------------
const mapStateToProps = ({report = {}}) => {
  const {
    data: {account_search_params = {}} = {},
    data,
    startDate,
    endDate,
    account,
  } = report || {};

  const createLinkHandler = (objectCode) => (e) => {
    const printPath = `/entries?startDate=${encodeURIComponent(
      startDate
    )}&endDate=${encodeURIComponent(endDate)}&account=${encodeURIComponent(
      JSON.stringify(Object.assign({}, account, {objectCode}))
    )}`;
    window.open(printPath);
  };
  const createBudgetLinkHandler = (objectCode) => (e) => {
    e.stopPropagation();
    const printPath = `/accounts?startDate=${encodeURIComponent(
      startDate
    )}&endDate=${encodeURIComponent(endDate)}&account=${encodeURIComponent(
      JSON.stringify(
        Object.assign({}, account, {objectCode}, account_search_params)
      )
    )}`;
    window.open(printPath);
  };

  return {
    ...report,
    data,
    createLinkHandler,
    createBudgetLinkHandler,
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
      dispatch({type: "RUN_BUDGET_VS_ACTUAL_REPORT"});
    },
    handleExportClick: () => {
      setExportModalOpen();
    },
    handleRunReportClick: () => {
      dispatch({type: "RUN_BUDGET_VS_ACTUAL_REPORT"});
    },
    loadReport: () => {
      dispatch({type: "LOAD_BUDGET_VS_ACTUAL_REPORT"});
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
)(ProfitAndLossStatement);
