// StatementReducer Store
//------------------------------------------------------------------------------

import {removeItem} from "../utils";

function StatementReducerStore(state = {}, action) {
  const {
    id,
    item_type,
    amount_in_cents,
    started_at,
    ended_at,
    type_filter,
    items,
    ending_balance,
  } = action;

  switch (action.type) {
    case "SET_STARTED_AT":
      return Object.assign({}, state, {started_at});
    case "SET_ENDED_AT":
      return Object.assign({}, state, {ended_at});
    case "SET_TYPE":
      return Object.assign({}, state, {type_filter});
    case "SET_ITEMS":
      return Object.assign({}, state, {items});
    case "SELECT_ITEM":
      return Object.assign({}, state, {
        selectedItems: [
          {id, type: item_type, amount_in_cents},
          ...state.selectedItems,
        ],
      });
    case "UNSELECT_ITEM":
      return Object.assign({}, state, {
        selectedItems: removeItem(state.selectedItems, id),
      });
    case "SET_ENDING_BALANCE":
      return Object.assign({}, state, {ending_balance});

    default:
      return state;
  }
}

export const defaultState = {
  type_filter: "ALL",
  ending_balance: "0",
  items: [],
  selectedItems: [],
};

export default StatementReducerStore;
