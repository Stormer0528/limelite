import findIndex from "lodash/findIndex";
import produce from "immer";

const VendorsModel = {
  state: [],
  reducers: {
    setUpdatedState: (state, {id, updateState}) =>
      produce(state, draftState => {
        const vendorIndex = findIndex(state, {id});
        draftState[vendorIndex] = Object.assign({}, state[vendorIndex], {
          aasm_state: updateState,
        });
      }),
  },
};

export default VendorsModel;
