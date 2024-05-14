import {connect} from "react-redux";
import {compose} from "redux";

// Components
import Sidebar from "./sidebar";

const mapStateToProps = ({
  report: {
    showActiveRows = false,
    showActiveColumns = false,
    periods = 3,
    daysPerPeriod = 30,
  },
}) => {
  return {
    showActiveRows,
    showActiveColumns,
    periods,
    daysPerPeriod,
  };
};

const mapDispatchToProps = dispatch => {
  const {
    report: {
      setShowActiveRows,
      setShowActiveColumns,
      setPeriods,
      setDaysPerPeriod,
    },
  } = dispatch;
  return {
    handleShowActiveRowsChange: (_e, value) => {
      setShowActiveRows(value);
    },
    handleShowActiveColumnsChange: (_e, value) => {
      setShowActiveColumns(value);
    },
    handlePeriodsChange: ({target: {value}}) => {
      setPeriods(value);
    },
    handleDaysPerPeriodChange: ({target: {value}}) => {
      setDaysPerPeriod(value);
    },
  };
};

// Export
//------------------------------------------------------------------------------
export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(Sidebar);
