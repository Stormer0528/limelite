import produce from "immer";
import {removeItemAtIndex} from "../../../utils";

const defaultState = {
  date: new Date(),
  type: "Journal Entry",
  entryItems: [
    {debit: 0, credit: "", memo: "", type: "Debit", changed: false},
    {credit: 0, debit: "", memo: "", type: "Credit", changed: false},
  ],
  currentEntryIndex: 0,
  defaultObjectCode: "9500",
  defaultAutofillType: "Credit",
};

const EntryModel = {
  state: defaultState,
  reducers: {
    setDate: (state, date) => Object.assign({}, state, {date}),
    setEntryType: (state, type) => {
      return Object.assign({}, state, {type});
    },
    setMemo: (state, memo) => Object.assign({}, state, {memo}),
    setCurrentEntryIndex: (state, currentEntryIndex) =>
      Object.assign({}, state, {currentEntryIndex}),
    setEntryItemCredit: (state, {id, amount}) =>
      produce(state, draftState => {
        if (state.entryItems[id]) {
          draftState.entryItems[id].amount = amount;
          draftState.entryItems[id].credit = amount;
          draftState.entryItems[id].debit = "";
          draftState.entryItems[id].type = "Credit";
        }
      }),
    setEntryItemDebit: (state, {id, amount}) =>
      produce(state, draftState => {
        if (state.entryItems[id]) {
          draftState.entryItems[id].amount = amount;
          draftState.entryItems[id].debit = amount;
          draftState.entryItems[id].credit = "";
          draftState.entryItems[id].type = "Debit";
        }
      }),
    setEntryItemMemo: (state, {id, memo}) =>
      produce(state, draftState => {
        draftState.entryItems[id].memo = memo;
      }),
    setEntryItemPayableId: (state, {id, payableId, payableType}) =>
      produce(state, draftState => {
        draftState.entryItems[id].payableId = payableId;
        draftState.entryItems[id].payableType = payableType;
      }),
    setEntryFundCode: (state, {id, value: fundCode}) =>
      produce(state, draftState => {
        draftState.entryItems[id].fundCode = fundCode;
        draftState.currentEntryIndex = id;
        draftState.entryItems[id].changed = true;
      }),

    setEntryFunctionCode: (state, {id, value: functionCode}) =>
      produce(state, draftState => {
        draftState.entryItems[id].functionCode = functionCode;
        draftState.currentEntryIndex = id;
        draftState.entryItems[id].changed = true;
      }),
    setEntryGoalCode: (state, {id, value: goalCode}) =>
      produce(state, draftState => {
        draftState.entryItems[id].goalCode = goalCode;
        draftState.currentEntryIndex = id;
        draftState.entryItems[id].changed = true;
      }),
    setEntryLocationCode: (state, {id, value: locationCode}) =>
      produce(state, draftState => {
        draftState.entryItems[id].locationCode = locationCode;
        draftState.currentEntryIndex = id;
        draftState.entryItems[id].changed = true;
      }),
    setEntryObjectCode: (state, {id, value: objectCode}) =>
      produce(state, draftState => {
        draftState.entryItems[id].objectCode = objectCode;
        draftState.currentEntryIndex = id;
        draftState.entryItems[id].changed = true;
      }),
    setEntryResourceCode: (state, {id, value: resourceCode}) =>
      produce(state, draftState => {
        draftState.entryItems[id].resourceCode = resourceCode;
        draftState.currentEntryIndex = id;
        draftState.entryItems[id].changed = true;
      }),
    setEntryYearCode: (state, {id, value: yearCode}) =>
      produce(state, draftState => {
        draftState.entryItems[id].yearCode = yearCode;
        draftState.currentEntryIndex = id;
        draftState.entryItems[id].changed = true;
      }),
    addEntryItem: state =>
      produce(state, draftState => {
        if (!draftState.entryItems) {
          draftState.entryItems = [];
        }
        draftState.entryItems.push({memo: "", credit: "", debit: ""});
      }),
    removeEntryItem: (state, id) => {
      const {entryItems = []} = state;
      return Object.assign({}, state, {
        entryItems: removeItemAtIndex(entryItems, id),
      });
    },
    updateCurrentEntryItem: (state, {entryItem, id}) => {
      return produce(state, draft => {
        const newEntryItem = Object.assign(
          {},
          state.entryItems[id],
          entryItem,
          {
            valid: true,
          }
        );
        draft.entryItems[id] = newEntryItem;
      });
    },
    resetEntry: () => ({
      ...defaultState,
      date: new Date(),
      type: "Transaction",
      memo: "",
      entryItems: [
        {credit: 0, memo: ""},
        {debit: 0, memo: ""},
      ],
      currentEntryIndex: 0,
    }),
    setValidationErrors: (state, errors = []) =>
      produce(state, draft => {
        draft.errors = errors;
      }),
    validateAccount: (state, {id, account}) =>
      produce(state, draft => {
        if (!state.entryItems[id]) {
          return;
        }

        if (!account) {
          draft.entryItems[id].valid = false;
        } else {
          const newEntryItem = Object.assign(
            {},
            state.entryItems[id],
            account,
            {
              valid: true,
              accountId: account.id,
              accountName: account.name,
            }
          );
          draft.entryItems[id] = newEntryItem;
        }
      }),
  },
  // Async Actions
  // effects: {}
};

export default EntryModel;
