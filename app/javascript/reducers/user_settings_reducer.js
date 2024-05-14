// User Store
//------------------------------------------------------------------------------

function UserSettingsStore(state = [], action) {
  switch (action.type) {
    case "SELECT_SCHOOL_SETTING":
      return Object.assign({}, state, {school: action.id});
    case "SELECT_ROLE_SETTING":
      return Object.assign({}, state, {role: action.role});
    case "SET_ADMIN_SETTING":
      return Object.assign({}, state, {admin: action.admin});
    case "TOGGLE_ADMIN_SETTING":
      return Object.assign({}, state, {admin: !state.admin});
    default:
      return state;
  }
}

export const defaultState = {
  school: -1,
  role: "",
  admin: null,
};

export default UserSettingsStore;
