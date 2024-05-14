// AccountFinder Store
//------------------------------------------------------------------------------

function AccountFinderStore(state = {}, action) {
  const {
    fund_id,
    function_id,
    location_id,
    year_id,
    goal_id,
    object_id,
    resource_id,
    accounts,
    name,
    minimized,
    open,
  } = action;
  switch (action.type) {
    case "SET_FINDER_FUND_ID":
      return Object.assign({}, state, {fund_id});
    case "SET_FINDER_FUNCTION_ID":
      return Object.assign({}, state, {function_id});
    case "SET_FINDER_LOCATION_ID":
      return Object.assign({}, state, {location_id});
    case "SET_FINDER_YEAR_ID":
      return Object.assign({}, state, {year_id});
    case "SET_FINDER_GOAL_ID":
      return Object.assign({}, state, {goal_id});
    case "SET_FINDER_OBJECT_ID":
      return Object.assign({}, state, {object_id});
    case "SET_FINDER_RESOURCE_ID":
      return Object.assign({}, state, {resource_id});
    case "SET_ACCOUNT_FINDER_ACCOUNTS":
      return Object.assign({}, state, {accounts});
    case "SET_FUND_ID":
      return Object.assign({}, state, {fund_id});
    case "SET_FUNCTION_ID":
      return Object.assign({}, state, {function_id});
    case "SET_LOCATION_ID":
      return Object.assign({}, state, {location_id});
    case "SET_YEAR_ID":
      return Object.assign({}, state, {year_id});
    case "SET_GOAL_ID":
      return Object.assign({}, state, {goal_id});
    case "SET_OBJECT_ID":
      return Object.assign({}, state, {object_id});
    case "SET_RESOURCE_ID":
      return Object.assign({}, state, {resource_id});
    case "SET_ACCOUNT_ACCOUNTS":
      return Object.assign({}, state, {accounts});
    case "TOGGLE_ACCOUNT_FINDER_MINIMIZED":
      return Object.assign({}, state, {minimized: !state.minimized});
    case "SET_ACCOUNT_FINDER_MINIMIZED":
      return Object.assign({}, state, {minimized});
    case "TOGGLE_ACCOUNT_FINDER_OPEN":
      return Object.assign({}, state, {open: !state.open});
    case "SET_ACCOUNT_FINDER_OPEN":
      return Object.assign({}, state, {open});
    case "SET_ACCOUNT_FINDER_NAME":
      return Object.assign({}, state, {name});

    default:
      return state;
  }
}

export default AccountFinderStore;

export const defaultState = {
  accounts: [],
  minimized: true /* handles accound finder in modal */,
  open: false /* handles modal open */,
  name: "",
};
