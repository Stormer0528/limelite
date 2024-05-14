export function setSortColumn(column) {
  return {type: "SET_SORT_COLUMN", column};
}

export function setSortDirection(direction, column) {
  return {type: "SET_SORT_DIRECTION", direction, column};
}

export function setSortFunction(customSortFunc) {
  return {type: "SET_SORT_FUNCTION", customSortFunc};
}

export function selectRow(row) {
  return {type: "SELECT_ROW", row};
}

export function toggleSelectAllRows(selectAll) {
  return {type: "TOGGLE_SELECT_ALL_ROWS", selectAll: !selectAll};
}
