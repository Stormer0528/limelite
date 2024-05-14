// Bank Account Print Filter Store
//------------------------------------------------------------------------------

function BankAccountStore(state = {}, action) {
  const {accounts, filter: current_filter} = state;
  const {
    account,
    startDateFilter: start_date,
    endDateFilter: end_date,
    memoFilter: memo,
    typeFilter: type,
    reconciledFilter: reconciled,
  } = action;

  switch (action.type) {
    case "ADD_ACCOUNT":
      return Object.assign({}, state, {accounts: [...accounts, account]});
    case "SET_START_DATE_FILTER":
      return Object.assign({}, state, {
        filter: Object.assign({}, current_filter, {start_date}),
      });
    case "SET_END_DATE_FILTER":
      return Object.assign({}, state, {
        filter: Object.assign({}, current_filter, {end_date}),
      });
    case "SET_MEMO_FILTER":
      return Object.assign({}, state, {
        filter: Object.assign({}, current_filter, {memo}),
      });
    case "SET_TYPE_FILTER":
      return Object.assign({}, state, {
        filter: Object.assign({}, current_filter, {type}),
      });
    case "SET_RECONCILED_FILTER":
      return Object.assign({}, state, {
        filter: Object.assign({}, current_filter, {reconciled}),
      });

    default:
      return state;
  }
}

export const defaultState = {
  accounts: [],
  currentAccount: null,
  filter: {
    start_date: "",
    end_date: "",
    type: "",
    memo: "",
    reconciled: false,
  },
};

export default BankAccountStore;
