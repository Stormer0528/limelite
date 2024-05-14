import produce from "immer";
import {reducerActons as DateActions} from "../../../components/shared/date_range_toggle";
import {reducerActons as AmountActions} from "../../../components/shared/amount_toggle";

const EntryTableModel = {
  state: {
    filter: {
      dateFilter: "After",
      amountFilter: "Min",
      account: {},
    },
    sort: {},
    ui: {},
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
  },

  // Async Actions
  // effects: {}
};

export default EntryTableModel;
