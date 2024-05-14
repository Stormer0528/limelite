import {connect} from "react-redux";
import {compose} from "redux";
import DateWrapper from "../../shared/date_wrapper";
import ThemeWrapper from "../../shared/theme_wrapper";
import {lifecycle} from "recompose";

import BalanceSheet from "./balance_sheet";

// Actions
import {
  runComparativeBalanceSheetReport,
  saveComparativeBalanceSheetReport,
} from "../../../actions/report_actions";

// Redux
//------------------------------------------------------------------------------
const mapStateToProps = ({
  report,
  report: {startDate, endDate, account, data = "{}"},
}) => {
  const createLinkHandler = (objectCode) => () => {
    const printPath = `/entries?startDate=${encodeURIComponent(
      startDate
    )}&endDate=${encodeURIComponent(endDate)}&account=${encodeURIComponent(
      JSON.stringify(Object.assign({}, account, {objectCode}))
    )}`;
    window.open(printPath);
  };

  try {
    const parsedData = JSON.parse(data);
    return {...report, data: parsedData, createLinkHandler};
  } catch {
    return {...report, data: {}, createLinkHandler};
  }
};

const mapDispatchToProps = (dispatch) => {
  const {
    report: {
      setReportPeriod,
      setStartDate,
      setEndDate,
      setTitle,
      setSubtitle,
      setNotes,
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

    handleTitleChange: ({target: {value}}) => {
      setTitle(value);
    },

    handleSubtitleChange: ({target: {value}}) => {
      setSubtitle(value);
    },

    handleNotesChange: ({target: {value}}) => {
      setNotes(value);
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
      dispatch(saveComparativeBalanceSheetReport());
    },
    handleExportClick: () => {
      setExportModalOpen();
    },
    handleRunReportClick: () => {
      dispatch(runComparativeBalanceSheetReport());
    },
    loadReport: () => {
      dispatch({type: "LOAD_COMPARATIVE_BALANCE_SHEET_REPORT"});
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
)(BalanceSheet);
