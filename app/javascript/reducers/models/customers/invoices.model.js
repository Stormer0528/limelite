import findIndex from "lodash/findIndex";
import produce from "immer";

const InvoicesModel = {
  state: [],
  reducers: {
    setUpdatedState: (state, {id, updateState}) =>
      produce(state, draftState => {
        const invoiceIndex = findIndex(state, {id});
        draftState[invoiceIndex] = Object.assign({}, state[invoiceIndex], {
          aasm_state: updateState,
        });
      }),
  },
};

export default InvoicesModel;
