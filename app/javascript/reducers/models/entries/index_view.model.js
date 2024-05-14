import produce from "immer";
import {reducerActons as DateActions} from "../../../components/shared/date_range_toggle";
import {reducerActons as AmountActions} from "../../../components/shared/amount_toggle";

const EntryIndexModel = {
  state: {
    filter: {
      account: {},
    },
    sort: {},
    ui: {
      ledgerView: "summary",
    },
  },
  reducers: {
    ...DateActions /* setDateToggle, setBeforeDateFilter, setAfterDateFilter */,
    ...AmountActions /* setAmountToggle setMaxAmountFilter setMinAmountFilter */,
    setTypeFilter: (state, type) =>
      produce(state, draft => {
        if (!state.filter) {
          draft.filter = {};
        }
        draft.filter.type = type;
      }),
    setMemoFilter: (state, memo) =>
      produce(state, draft => {
        if (!state.filter) {
          draft.filter = {};
        }
        draft.filter.memo = memo;
      }),
    setEntryTypeFilter: (state, entry_type) =>
      produce(state, draft => {
        if (!state.filter) {
          draft.filter = {};
        }
        draft.filter.entry_type = entry_type;
      }),
    setJournalTypeFilter: (state, journalable_type) =>
      produce(state, draft => {
        if (!state.filter) {
          draft.filter = {};
        }
        draft.filter.journalable_type = journalable_type;
      }),
    setStateFilter: (state, aasm_state) =>
      produce(state, draft => {
        if (!state.filter) {
          draft.filter = {};
        }
        draft.filter.aasm_state = aasm_state;
      }),
    setToAccountFund: (state, fund) =>
      produce(state, draft => {
        if (!state.filter || !state.filter.toAccount) {
          draft.filter = {};
          draft.filter.toAccount = {};
        }

        draft.filter.toAccount.fundCode = fund;
      }),
    setToAccountResource: (state, resource) =>
      produce(state, draft => {
        if (!state.filter || !state.filter.toAccount) {
          draft.filter = {};
          draft.filter.toAccount = {};
        }
        draft.filter.toAccount.resourceCode = resource;
      }),
    setToAccountYear: (state, year) =>
      produce(state, draft => {
        if (!state.filter || !state.filter.toAccount) {
          draft.filter = {};
          draft.filter.toAccount = {};
        }
        draft.filter.toAccount.yearCode = year;
      }),
    setToAccountGoal: (state, goal) =>
      produce(state, draft => {
        if (!state.filter || !state.filter.toAccount) {
          draft.filter = {};
          draft.filter.toAccount = {};
        }
        draft.filter.toAccount.goalCode = goal;
      }),
    setToAccountFunction: (state, accountFunction) =>
      produce(state, draft => {
        if (!state.filter || !state.filter.toAccount) {
          draft.filter = {};
          draft.filter.toAccount = {};
        }
        draft.filter.toAccount.functionCode = accountFunction;
      }),
    setToAccountObject: (state, accountObject) =>
      produce(state, draft => {
        if (!state.filter || !state.filter.toAccount) {
          draft.filter = {};
          draft.filter.toAccount = {};
        }
        draft.filter.toAccount.objectCode = accountObject;
      }),
    setToAccountLocation: (state, accountLocation) =>
      produce(state, draft => {
        if (!state.filter || !state.filter.toAccount) {
          draft.filter = {};
          draft.filter.toAccount = {};
        }
        draft.filter.toAccount.locationCode = accountLocation;
      }),
    setAccountFund: (state, fund) =>
      produce(state, draft => {
        if (!state.filter || !state.filter.account) {
          draft.filter = {};
          draft.filter.account = {};
        }

        draft.filter.account.fundCode = fund;
      }),
    setAccountResource: (state, resource) =>
      produce(state, draft => {
        if (!state.filter || !state.filter.account) {
          draft.filter = {};
          draft.filter.account = {};
        }
        draft.filter.account.resourceCode = resource;
      }),
    setAccountYear: (state, year) =>
      produce(state, draft => {
        if (!state.filter || !state.filter.account) {
          draft.filter = {};
          draft.filter.account = {};
        }
        draft.filter.account.yearCode = year;
      }),
    setAccountGoal: (state, goal) =>
      produce(state, draft => {
        if (!state.filter || !state.filter.account) {
          draft.filter = {};
          draft.filter.account = {};
        }
        draft.filter.account.goalCode = goal;
      }),
    setAccountFunction: (state, accountFunction) =>
      produce(state, draft => {
        if (!state.filter || !state.filter.account) {
          draft.filter = {};
          draft.filter.account = {};
        }
        draft.filter.account.functionCode = accountFunction;
      }),
    setAccountObject: (state, accountObject) =>
      produce(state, draft => {
        if (!state.filter || !state.filter.account) {
          draft.filter = {};
          draft.filter.account = {};
        }
        draft.filter.account.objectCode = accountObject;
      }),
    setAccountLocation: (state, accountLocation) =>
      produce(state, draft => {
        if (!state.filter || !state.filter.account) {
          draft.filter = {};
          draft.filter.account = {};
        }
        draft.filter.account.locationCode = accountLocation;
      }),
    setUiDetailView: state =>
      produce(state, draft => {
        if (!state.ui) {
          draft.ui = {ledgerView: "detail"};
        }
        draft.ui.ledgerView =
          state.ui.ledgerView === "detail" ? "summary" : "detail";
      }),
  },

  // Async Actions
  // effects: {}
};

export default EntryIndexModel;
