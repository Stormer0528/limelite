// import produce from "immer";
import ReportBase from "./shared/report_base.model";
import AFBase from "./shared/account_finder_base.model";

const CashFlowReportModel = {
  // Initial State
  state: Object.assign({}, ReportBase.state, AFBase.state, {
    title: "Cash Flow Report",
    // More state here ...
  }),

  // Reducer / Actions
  reducers: Object.assign({}, ReportBase.reducers, AFBase.reducers, {
    // More actions here ...
  }),

  // Async Actions
  // effects: (dispatch) => ({}),
};

export default CashFlowReportModel;
