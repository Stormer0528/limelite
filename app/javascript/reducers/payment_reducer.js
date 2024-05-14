// Account Store
//------------------------------------------------------------------------------

function PaymentStore(state = {}, action) {
  const {finalPayment} = action;
  switch (action.type) {
    case "TOGGLE_FINAL_PAYMENT":
      return Object.assign({}, {finalPayment: !state.finalPayment});
    case "SET_FINAL_PAYMENT":
      return Object.assign({}, {finalPayment});
    default:
      return state;
  }
}

export const defaultState = {
  finalPayment: false,
};

export default PaymentStore;
