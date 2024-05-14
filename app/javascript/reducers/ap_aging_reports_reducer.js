// ApAgingReports Store
//------------------------------------------------------------------------------

function ApAgingReportsStore(state = [], action) {
  switch (action.type) {
    case "SET_START_DATE":
      return Object.assign({}, state, {startDate: action.startDate});
    case "SET_END_DATE":
      return Object.assign({}, state, {endDate: action.endDate});
    case "SET_PERIOD":
      return Object.assign({}, state, {period: action.period});
    case "SET_PERIOD_NUMBER":
      return Object.assign({}, state, {periodNumber: action.periodNumber});
    case "SET_AGING_PERIOD_DAYS":
      return Object.assign({}, state, {
        agingPeriodDays: action.agingPeriodDays,
      });

    default:
      return state;
  }
}

export default ApAgingReportsStore;
