// Notifications Store
//------------------------------------------------------------------------------

function NotificationsStore(state = {}, action) {
  const {notificationMessage, notificationType, open} = action;

  switch (action.type) {
    case "SET_NOTIFICATION_MESSAGE_OPEN":
      return Object.assign({}, state, {open});
    case "TOGGLE_NOTIFICATION_MESSAGE_OPEN":
      return Object.assign({}, state, {open: !state.open});
    case "SET_NOTIFICATION_MESSAGE":
      return Object.assign({}, state, {notificationMessage});
    case "SET_NOTIFICATION_TYPE":
      return Object.assign({}, state, {notificationType});

    default:
      return state;
  }
}

export default NotificationsStore;

export const defaultState = {
  open: false,
  message: "",
  type: "info",
};
