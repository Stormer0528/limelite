import {findIndex} from "lodash";

function DataStore(state = [], action) {
  const {data, item, row = {}, selectAll = false} = action;
  switch (action.type) {
    case "SET_DATA":
      return data;
    case "APPEND_DATA":
      return [...state, ...data];
    case "PREPEND_DATA":
      return [...data, ...state];
    case "APPEND_ITEM":
      return [...state, item];
    case "PREPEND_ITEM":
      return [item, ...state];
    case "SELECT_ROW":
      return updateItem(row, state);
    case "TOGGLE_SELECT_ALL_ROWS":
      return state.map(rowData => {
        return Object.assign({}, rowData, {selected: selectAll});
      });
    default:
      return state;
  }
}

export default DataStore;

export const defaultState = [];

// Utility Functions
//------------------------------------------------------------------------------

const updateItem = (row_data, group) => {
  const {id, selected = false} = row_data;
  const rowIndex = findIndex(group, {id});
  const newRow = Object.assign({}, row_data, {selected: !selected});

  return [
    ...group.slice(0, rowIndex),
    newRow,
    ...group.slice(rowIndex + 1, group.length),
  ];
};
