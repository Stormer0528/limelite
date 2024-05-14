function SortStore(state = {}, action) {
  const {column, customSortFunc = false} = action;

  switch (action.type) {
    case "SET_SORT_DIRECTION":
      return Object.assign({}, state, {
        direction: toggleSortDirection(state.direction, column),
      });
    case "SET_SORT_COLUMN":
      return Object.assign({}, state, {column});
    case "SET_SORT_FUNCTION":
      return Object.assign({}, state, {customSortFunc});

    default:
      return state;
  }
}

export default SortStore;

export const defaultState = {
  direction: null,
  column: null,
};

function toggleSortDirection(currentDirection, column) {
  if (typeof column !== "string") {
    const {disableSort = true} = column;

    if (disableSort) {
      return null;
    }
  }

  switch (currentDirection) {
    case "ASC":
      return null;
    case "DESC":
      return "ASC";
    default:
      return "DESC";
  }
}
