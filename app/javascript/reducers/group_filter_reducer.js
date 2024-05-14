// Group Store
//------------------------------------------------------------------------------

function GroupFilterStore (state = [], action) {
  switch (action.type) {
    case "SET_ORGANIZATION":
      return Object.assign({}, state, {organization: action.id});
    default:
      return state;
  }
}

export const defaultState = {
  organization: -1
};

export default GroupFilterStore;
