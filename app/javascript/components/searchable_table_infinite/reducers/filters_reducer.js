function FilterStore(state = {}, action) {
  switch (action.type) {
    default:
      return state;
  }
}

export default FilterStore;

export const defaultState = {
  fields: [],
  values: [],
};
