// PrinterSettings Actions
//------------------------------------------------------------------------------

export function setCurrentPrinterSetting(currentPrinterSettingId) {
  return {type: "SET_CURRENT_PRINTER_SETTING", currentPrinterSettingId};
}

export function addSelectedItem(item) {
  return {type: "ADD_SELECTED_ITEM", item};
}

export function removeSelectedItem(item) {
  return {type: "REMOVE_SELECTED_ITEM", item};
}

export function selectAllItems() {
  return {type: "SELECT_ALL_ITEMS"};
}

export function deselectAllItems() {
  return {type: "DESELECT_ALL_ITEMS"};
}

export function setStartingCheckNumber(starting_check_number) {
  return {type: "SET_STARTING_CHECK_NUMBER", starting_check_number};
}

export function setCheckNumber(number, item) {
  return {type: "SET_CHECK_NUMBER", number, item};
}

export function setFilterStartDate(start_date) {
  return {type: "SET_FILTER_START_DATE", start_date};
}

export function setFilterEndDate(end_date) {
  return {type: "SET_FILTER_END_DATE", end_date};
}
