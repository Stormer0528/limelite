// PrinterSettings Store
//------------------------------------------------------------------------------
import produce from "immer";

function PrinterSettingsStore(state = {}, action) {
  const {
    currentPrinterSettingId,
    selectedChecks = [],
    item,
    number,
    start_date,
    end_date,
    checks,
    starting_check_number,
  } = action;
  switch (action.type) {
    case "SET_CURRENT_PRINTER_SETTING":
      return Object.assign({}, state, {currentPrinterSettingId});
    case "ADD_SELECTED_ITEM":
      return produce(state, draftState => {
        if (!state.selectedItems) {
          draftState.selectedItems = {};
        }

        draftState.selectedItems[item.id] = item;
        draftState.checks[item.id].selected = true;
      });
    case "REMOVE_SELECTED_ITEM":
      return produce(state, draftState => {
        delete draftState.selectedItems[item.id];
        draftState.checks[item.id].selected = false;
      });
    case "LOAD_CHECKS":
      return produce(state, draftState => {
        const newChecks = {};
        checks.forEach(check => {
          newChecks[check.id] = check;
        });
        draftState.checks = newChecks;
      });
    case "SELECT_ALL_ITEMS":
      return Object.assign({}, state, {selectedChecks: state.checks});
    case "DESELECT_ALL_ITEMS":
      return Object.assign({}, state, {selectedChecks: {}});
    case "SET_SELECTED_CHECKS":
      return Object.assign({}, state, {selectedChecks});
    case "SET_STARTING_CHECK_NUMBER":
      return Object.assign({}, state, {starting_check_number});
    case "SET_FILTER_START_DATE":
      return produce(state, draftState => {
        draftState.filter.start_date = start_date.toString();
      });
    case "SET_FILTER_END_DATE":
      return produce(state, draftState => {
        draftState.filter.end_date = end_date.toString();
      });
    case "SET_CHECK_NUMBER":
      return produce(state, draftState => {
        if (state.selectedItems && state.selectedItems[item.id]) {
          draftState.selectedItems[item.id].number = number;
        }

        draftState.checks[item.id].number = number;
        draftState.checks[item.id].selected = true;
      });
    default:
      return state;
  }
}

export const defaultState = {
  checks: [],
  selectedChecks: {},
  selected_check_total: "$0.00",
  selected_check_count: 0,
  starting_check_number: "",
  filter: {},
};

export default PrinterSettingsStore;
