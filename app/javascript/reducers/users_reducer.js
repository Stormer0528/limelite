import produce from "immer";

// User Store
//------------------------------------------------------------------------------

function UsersStore(state = [], action) {
  const {type, id, ids = []} = action;

  switch (type) {
    case "SET_USER_MESAGE_TYPE":
      return Object.assign({}, state, {
        messageType: action.messageType,
      });
    case "SET_USER_MESAGE":
      return Object.assign({}, state, {
        userMessage: action.userMessage,
      });
    case "HIDE_USER_MESAGE":
      return Object.assign({}, state, {
        userMessageVisible: false,
      });
    case "SHOW_USER_MESAGE":
      return Object.assign({}, state, {
        userMessageVisible: true,
      });
    case "REMOVE_USER":
      return produce(state, draft => {
        delete draft.users[id];
        if (state.selected && state.selected[id]) {
          delete draft.selected[id];
        }
      });
    case "SELECT_USER":
      return produce(state, draft => {
        const {users = {}} = state;
        const user = Object.assign({}, users[id]);
        if (!draft.selected) {
          draft.selected = {};
        }
        draft.selected[id] = user;
        draft.users[id].selected = true;
      });
    case "UNSELECT_USER":
      return produce(state, draft => {
        delete draft.selected[id];
        draft.users[id].selected = false;
      });
    case "SELECT_ALL_USERS":
      return produce(state, draft => {
        draft.allSelected = true;
        ids.forEach(id => {
          const {users = {}} = state;
          const user = Object.assign({}, users[id]);
          if (!draft.selected) {
            draft.selected = {};
          }
          draft.selected[id] = user;
          draft.users[id].selected = true;
        });
      });
    case "UNSELECT_ALL_USERS":
      return produce(state, draft => {
        draft.allSelected = false;
        ids.forEach(id => {
          delete draft.selected[id];
          draft.users[id].selected = false;
        });
      });
    default:
      return state;
  }
}

export const defaultState = {
  users: [],
  selected: {},
  userMessageVisible: false,
  userMessage: "",
  messageType: "",
};

export default UsersStore;
