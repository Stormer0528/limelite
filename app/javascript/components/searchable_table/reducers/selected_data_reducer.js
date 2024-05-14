import {findIndex} from "lodash";
import removeItem from "../utils/removeItem";

function SelectedDataStore(state = {}, action) {
  const {row = {}} = action;
  const {selectedRowCount = 0, selectedRows = [], selectAll} = state;
  switch (action.type) {
    case "SELECT_ROW":
      return Object.assign({}, state, {
        selectedRows: updateItem(row, selectedRows),
        selectedRowCount: selectedRowCount + 1,
      });
    case "DESELECT_ROW":
      return removeItem(row.id, selectedRows);
    case "TOGGLE_SELECT_ALL_ROWS":
      if (selectAll) {
        return defaultState;
      }
      return Object.assign({}, state, {
        selectAll: true,
      });
    default:
      return state;
  }
}

export default SelectedDataStore;

export const defaultState = {
  selectedRows: [],
  selectedRowCount: 0,
  selectAll: false,
};

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
