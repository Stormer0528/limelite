// import produce from "immer";
import ReportBase from "./shared/report_base.model";
import AFBase from "./shared/account_finder_base.model";

const ProfitAndLossStatementModel = {
  // Initial State
  state: Object.assign({}, ReportBase.state, AFBase.state, {
    // Additional Methods
  }),

  // Reducer / Actions
  reducers: Object.assign({}, ReportBase.reducers, AFBase.reducers, {
    // More Actions here ...
  }),

  // Async Actions
  // effects: (dispatch) => ({}),
};

export default ProfitAndLossStatementModel;
