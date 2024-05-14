// CreditCard Store
//------------------------------------------------------------------------------

function CreditCardStore(state = {}, action) {
  const {accounts, currentAccount} = state;
  const {account} = action;

  switch (action.type) {
    case "ADD_ACCOUNT":
      return Object.assign({}, state, {accounts: [...accounts, account]});
    case "REMOVE_ACCOUNT":
      return Object.assign({}, state, {
        /* modified Object */
      });
    case "ADD_CREDIT_CARD_CHARGE":
      return Object.assign({}, state, {
        /* modified Object */
      });
    case "REMOVE_CREDIT_CARD_CHARGE":
      return Object.assign({}, state, {
        /* modified Object */
      });
    case "SET_CURRENT_ACCOUNT":
      return Object.assign({}, state, {currentAccount: account});

    default:
      return state;
  }
}

export const defaultState = {
  accounts: [],
  currentAccount: null,
};

export default CreditCardStore;
