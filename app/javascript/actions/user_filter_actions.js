export function selectSchool(id) {
  return {type: "SELECT_SCHOOL", id};
}

export function selectRole(role) {
  return {type: "SELECT_ROLE", role};
}

export function setName(name) {
  return {type: "SET_NAME", name};
}

export function setEmail(email) {
  return {type: "SET_EMAIL", email};
}

export function setAdmin(admin) {
  return {type: "SET_ADMIN", admin};
}

export function toggleAdmin() {
  return {type: "TOGGLE_ADMIN"};
}

export function toggleArchived() {
  return {type: "TOGGLE_ARCHIVED"};
}

export function selectSchoolSetting(id) {
  return {type: "SELECT_SCHOOL_SETTING", id};
}

export function selectRoleSetting(role) {
  return {type: "SELECT_ROLE_SETTING", role};
}

export function toggleAdminSetting() {
  return {type: "TOGGLE_ADMIN_SETTING"};
}

export function selectUser(id) {
  return {type: "SELECT_USER", id};
}

export function unselectUser(id) {
  return {type: "UNSELECT_USER", id};
}

export function massUpdateUsers() {
  return {type: "MASS_UPDATE_USERS"};
}

export function destroyUser(url) {
  return {type: "DESTROY_USER", url};
}

export function setUserMessage(userMessage) {
  return {type: "SET_USER_MESAGE", userMessage};
}

export function hideUserMessage() {
  return {type: "HIDE_USER_MESAGE"};
}

export function showUserMessage() {
  return {type: "SHOW_USER_MESAGE"};
}

export function setUserMessageType(messageType) {
  return {type: "SHOW_USER_MESAGE_TYPE", messageType};
}

export function selectAllUsers(ids) {
  return {type: "SELECT_ALL_USERS", ids};
}

export function unselectAllUsers(ids) {
  return {type: "UNSELECT_ALL_USERS", ids};
}
