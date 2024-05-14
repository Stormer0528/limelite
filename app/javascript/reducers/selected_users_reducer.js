import {uniq, without} from "lodash";

// User Store
//------------------------------------------------------------------------------

function UsersStore(state = [], action) {
  switch (action.type) {
    case "SELECT_USER":
      return uniq([action.id, ...state]);
    case "UNSELECT_USER":
      return without(state, action.id);
    default:
      return state;
  }
}

export const defaultState = [];

export default UsersStore;
