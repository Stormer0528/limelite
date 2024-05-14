import findIndex from "lodash/findIndex";
import produce from "immer";

const CustomersModel = {
  state: [],
  reducers: {
    setUpdatedState: (state, {id, updateState}) =>
      produce(state, draftState => {
        const customersIndex = findIndex(state, {id});
        draftState[customersIndex] = Object.assign({}, state[customersIndex], {
          aasm_state: updateState,
        });
      }),
  },
};

export default CustomersModel;
