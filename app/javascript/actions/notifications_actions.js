// Notifications Actions
//------------------------------------------------------------------------------

export function toggleOpen() {
  return {type: "TOGGLE_NOTIFICATION_MESSAGE_OPEN"};
}

export function setOpen(open) {
  return {type: "SET_NOTIFICATION_MESSAGE_OPEN", open};
}

export function setNotificationMessage(notificationMessage) {
  return {type: "SET_NOTIFICATION_MESSAGE", notificationMessage};
}

export function setNotificationType(notificationType) {
  return {type: "SET_NOTIFICATION_TYPE", notificationType};
}
