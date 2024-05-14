// import produce from "immer";

const AccountElementsModel = {
  state: {
    account_functions: {},
    account_funds: {},
    account_goals: {},
    account_locations: {},
    account_objects: {},
    account_resources: {},
    account_years: {},
  },
  // Reducer / Actions
  reducers: {
    load: (state, accounts) => {
      return [
        "account_functions",
        "account_funds",
        "account_goals",
        "account_locations",
        "account_objects",
        "account_resources",
        "account_years",
      ].reduce((newState, elemType) => {
        newState[elemType] = accounts[elemType].reduce((obj, elem) => {
          obj[elem.code] = elem;
          return obj;
        }, {});

        return newState;
      }, {});
    },
  },
  // Async Actions
  // effects: {}
};

export default AccountElementsModel;

// HELPER FUNTIONS
//------------------------------------------------------------------------------
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
