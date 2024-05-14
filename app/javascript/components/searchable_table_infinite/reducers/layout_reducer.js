function LayoutStore(state = {}, action) {
  const {headers, columns} = action;

  switch (action.type) {
    case "SET_HEADERS":
      return Object.assign({}, state, {headers});
    case "SET_COLUMNS":
      return Object.assign({}, state, {columns});
    default:
      return state;
  }
}

export default LayoutStore;

export const defaultState = {
  headers: [],
  columns: [],
};
