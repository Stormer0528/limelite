import {find} from "lodash";

// Account Store
//------------------------------------------------------------------------------

function AccountStore(state = [], action) {
  const {accounts} = action;
  switch (action.type) {
    case "LOAD_CONTENT":
      return setDefaults(accounts);
    default:
      return state;
  }
}

function setDefaults(accountItems) {
  const defaults = {};
  for (const key of Object.keys(accountItems)) {
    defaults[key] = findDefault(accountItems[key]);
  }

  return Object.assign({}, accountItems, {defaults});
}

function findDefault(collection) {
  return find(collection, function({code}) {
    return code === "0" || code === "00" || code === "000" || code === "0000";
  });
}

export const defaultState = {
  functions: [],
  funds: [],
  goals: [],
  locations: [],
  objects: [],
  resources: [],
  schools: [],
  years: [],
};

export default AccountStore;
