// import produce from "immer";
// import merge from "lodash/merge";
import ReportBase from "./shared/report_base.model";
import AFBase from "./shared/account_finder_base.model";

const BalanceSheetModel = {
  // Initial State
  state: Object.assign({}, ReportBase.state, AFBase.state, {
    //
  }),

  // Reducer / Actions
  reducers: Object.assign({}, ReportBase.reducers, AFBase.reducers, {
    //
  }),

  // Async Actions
  // effects: (dispatch) => ({}),
};

export default BalanceSheetModel;
