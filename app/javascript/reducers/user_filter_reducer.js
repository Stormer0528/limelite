// User Store
//------------------------------------------------------------------------------

function UserFilterStore(state = [], action) {
  switch (action.type) {
    case "SELECT_SCHOOL":
      return Object.assign({}, state, {school: action.id});
    case "SELECT_ROLE":
      return Object.assign({}, state, {role: action.role});
    case "SET_NAME":
      return Object.assign({}, state, {name: action.name});
    case "SET_EMAIL":
      return Object.assign({}, state, {email: action.email});
    case "SET_ADMIN":
      return Object.assign({}, state, {admin: action.admin});
    case "TOGGLE_ADMIN":
      return Object.assign({}, state, {admin: !state.admin});
    case "TOGGLE_ARCHIVED":
      return Object.assign({}, state, {archived: !state.archived})
    default:
      return state;
  }
}

export const defaultState = {
  school: -1,
  role: "all",
  name: "",
  email: "",
  admin: false,
  archived: false
};

export default UserFilterStore;
