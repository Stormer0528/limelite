import produce from "immer";
import trim from "lodash/trim";

const AccountFinderBase = {
  state: {
    account: {},
  },
  reducers: {
    setAccountFund: (state, fund) =>
      produce(state, draft => {
        if (!state.account) {
          draft.account = {};
        }
        draft.account.fundCode = trim(fund) === "" ? null : fund;
      }),
    setAccountResource: (state, resource) =>
      produce(state, draft => {
        if (!state.account) {
          draft.account = {};
        }
        draft.account.resourceCode = trim(resource) === "" ? null : resource;
      }),
    setAccountYear: (state, year) =>
      produce(state, draft => {
        if (!state.account) {
          draft.account = {};
        }
        draft.account.yearCode = trim(year) === "" ? null : year;
      }),
    setAccountGoal: (state, goal) =>
      produce(state, draft => {
        if (!state.account) {
          draft.account = {};
        }
        draft.account.goalCode = goal;
      }),
    setAccountFunction: (state, accountFunction) =>
      produce(state, draft => {
        if (!state.account) {
          draft.account = {};
        }
        draft.account.functionCode =
          trim(accountFunction) === "" ? null : accountFunction;
      }),
    setAccountObject: (state, accountObject) =>
      produce(state, draft => {
        if (!state.account) {
          draft.account = {};
        }
        draft.account.objectCode =
          trim(accountObject) === "" ? null : accountObject;
      }),
    setAccountLocation: (state, accountLocation) =>
      produce(state, draft => {
        if (!state.account) {
          draft.account = {};
        }
        draft.account.locationCode =
          trim(accountLocation) === "" ? null : accountLocation;
      }),
  },
};

export default AccountFinderBase;
