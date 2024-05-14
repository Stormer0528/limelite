import produce from "immer";
import {reducerActons as DateActions} from "../../../components/shared/date_range_toggle";
import {reducerActons as AmountActions} from "../../../components/shared/amount_toggle";
const CreditCardModel = {
  state: {
    accounts: [],
    currentAccount: null,
    filter: {
      start_date: "",
      end_date: "",
      min_amount: "",
      max_amount: "",
      type: "",
      memo: "",
      reconciled: false,
    },
    ui: {
      ledgerView: "summary",
    },
  },
  reducers: {
    ...DateActions /* setDateToggle, setBeforeDateFilter, setAfterDateFilter */,
    ...AmountActions /* setAmountToggle setMaxAmountFilter setMinAmountFilter */,
    addAccount: (state, account) => {
      return Object.assign({}, state, {accounts: [...state.accounts, account]});
    },
    setMemoFilter: (state, memo) => {
      return Object.assign({}, state, {
        filter: Object.assign({}, state.filter, {memo}),
      });
    },
    setTypeFilter: (state, type) => {
      return Object.assign({}, state, {
        filter: Object.assign({}, state.filter, {type}),
      });
    },
    setReconciledFilter: (state, reconciled) => {
      return Object.assign({}, state, {
        filter: Object.assign({}, state.filter, {
          reconciled: reconciled ? null : false,
        }),
      });
    },
    setVendorFilter: (state, vendor_id) => {
      return Object.assign({}, state, {
        filter: Object.assign({}, state.filter, {vendor_id}),
      });
    },
    setStateFilter: (state, aasm_state) => {
      return Object.assign({}, state, {
        filter: Object.assign({}, state.filter, {aasm_state}),
      });
    },
    setNumberFilter: (state, number) => {
      return Object.assign({}, state, {
        filter: Object.assign({}, state.filter, {number}),
      });
    },
  },
};

export default CreditCardModel;
