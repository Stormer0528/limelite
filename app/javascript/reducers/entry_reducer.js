import {updateItemAtIndex, removeItemAtIndex} from "../utils";

// Entry Store
//------------------------------------------------------------------------------
//
// TODO Remove entry memo
// TODO Add entry_item memos
//

function EntryStore(state = {}, action) {
  const {
    id,
    amount,
    current_entry_index,
    date,
    entry_item,
    entry_type,
    errors,
    function_code,
    fund_code,
    goal_code,
    location_code,
    memo,
    object_code,
    resource_code,
    year_code,
  } = action;

  const {entry_items} = state;

  switch (action.type) {
    case "SET_DATE":
      return Object.assign({}, state, {date});
    case "SET_ENTRY_TYPE":
      return Object.assign({}, state, {entry_type});
    case "SET_MEMO":
      return Object.assign({}, state, {memo});
    case "RESET_ENTRY":
      return Object.assign({}, defaultState);
    case "SET_CURRENT_ENTRY_INDEX":
      return Object.assign({}, state, {current_entry_index});
    case "SET_ENTRY_ITEM_TYPE":
      return Object.assign({}, state, {
        entry_items: updateItemAtIndex(entry_items, {entry_type}, id),
        current_entry_index: id,
      });
    case "SET_ENTRY_ITEM_AMOUNT":
      return Object.assign({}, state, {
        entry_items: updateItemAtIndex(entry_items, {amount}, id),
        current_entry_index: id,
      });
    case "SET_ENTRY_FUND_CODE":
      return Object.assign({}, state, {
        entry_items: updateItemAtIndex(entry_items, {fund_code}, id),
        current_entry_index: id,
      });
    case "SET_ENTRY_FUNCTION_CODE":
      return Object.assign({}, state, {
        entry_items: updateItemAtIndex(entry_items, {function_code}, id),
        current_entry_index: id,
      });
    case "SET_ENTRY_GOAL_CODE":
      return Object.assign({}, state, {
        entry_items: updateItemAtIndex(entry_items, {goal_code}, id),
        current_entry_index: id,
      });
    case "SET_ENTRY_LOCATION_CODE":
      return Object.assign({}, state, {
        entry_items: updateItemAtIndex(entry_items, {location_code}, id),
        current_entry_index: id,
      });
    case "SET_ENTRY_OBJECT_CODE":
      return Object.assign({}, state, {
        entry_items: updateItemAtIndex(entry_items, {object_code}, id),
        current_entry_index: id,
      });
    case "SET_ENTRY_RESOURCE_CODE":
      return Object.assign({}, state, {
        entry_items: updateItemAtIndex(entry_items, {resource_code}, id),
        current_entry_index: id,
      });
    case "SET_ENTRY_YEAR_CODE":
      return Object.assign({}, state, {
        entry_items: updateItemAtIndex(entry_items, {year_code}, id),
        current_entry_index: id,
      });
    case "UPDATE_CURRENT_ENTRY_ITEM":
      return Object.assign({}, state, {
        entry_items: updateItemAtIndex(entry_items, entry_item, id),
        current_entry_index: id,
      });
    case "DELETE_ENTRY_ITEM":
      return Object.assign({}, state, {
        entry_items: removeItemAtIndex(entry_items, action.id),
      });
    case "ADD_ENTRY":
      return Object.assign({}, state, {
        entry_items: [...entry_items, {}],
      });
    case "ADD_CREDIT":
      return Object.assign({}, state, {
        entry_items: [...entry_items, {entry_type: "Credit"}],
      });
    case "ADD_DEBIT":
      return Object.assign({}, state, {
        entry_items: [...entry_items, {entry_type: "Debit"}],
      });
    case "SET_VALIDATION_ERRORS":
      return Object.assign({}, state, {errors});

    default:
      return state;
  }
}

export default EntryStore;

export const defaultState = {
  date: null,
  entry_type: "Journal Entry",
  memo: "",
  current_entry_index: 0,
  entry_items: [{entry_type: "Credit"}, {entry_type: "Debit"}],
};

// Helper Functions
//------------------------------------------------------------------------------

export const calculateBalance = (items = []) => {
  return items.reduce((total, {entry_type, amount = 0.0}) => {
    if (entry_type === "Credit") {
      return total + parseFloat(amount);
    } else if (entry_type === "Debit") {
      return total - parseFloat(amount);
    }

    return Number.parseFloat(total).toFixed(2);
  }, 0);
};
