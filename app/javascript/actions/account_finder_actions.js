// Entry Actions
//------------------------------------------------------------------------------

export function set_fundId(fund_id) {
  return {type: "SET_FINDER_FUND_ID", fund_id};
}

export function set_functionId(function_id) {
  return {type: "SET_FINDER_FUNCTION_ID", function_id};
}

export function set_locationId(location_id) {
  return {type: "SET_FINDER_LOCATION_ID", location_id};
}

export function set_yearId(year_id) {
  return {type: "SET_FINDER_YEAR_ID", year_id};
}

export function set_goalId(goal_id) {
  return {type: "SET_FINDER_GOAL_ID", goal_id};
}

export function set_objectId(object_id) {
  return {type: "SET_FINDER_OBJECT_ID", object_id};
}

export function set_resourceId(resource_id) {
  return {type: "SET_FINDER_RESOURCE_ID", resource_id};
}

export function set_element_fund_code({id, fund_code}) {
  return {type: "SET_ENTRY_FUND_CODE", id, fund_code};
}

export function set_element_function_code({id, function_code}) {
  return {type: "SET_ENTRY_FUNCTION_CODE", id, function_code};
}

export function set_element_goal_code({id, goal_code}) {
  return {type: "SET_ENTRY_GOAL_CODE", id, goal_code};
}

export function set_element_location_code({id, location_code}) {
  return {type: "SET_ENTRY_LOCATION_CODE", id, location_code};
}

export function set_element_object_code({id, object_code}) {
  return {type: "SET_ENTRY_OBJECT_CODE", id, object_code};
}

export function set_element_resource_code({id, resource_code}) {
  return {type: "SET_ENTRY_RESOURCE_CODE", id, resource_code};
}

export function set_element_year_code({id, year_code}) {
  return {type: "SET_ENTRY_YEAR_CODE", id, year_code};
}

export function setAccountFinderMimimized({minimized}) {
  return {type: "SET_ACCOUNT_FINDER_MINIMIZED", minimized};
}

export function toggleAccountFinderMinimized() {
  return {type: "TOGGLE_ACCOUNT_FINDER_MINIMIZED"};
}

export function setAccountFinderOpen({open}) {
  return {type: "SET_ACCOUNT_FINDER_OPEN", open};
}

export function toggleAccountFinderOpen() {
  return {type: "TOGGLE_ACCOUNT_FINDER_OPEN"};
}

export function setAccountFinderName(name) {
  return {type: "SET_ACCOUNT_FINDER_NAME", name};
}

export function createAccountFinderAccount() {
  return {type: "CREATE_ACCOUNT_FINDER_ACCOUNT"};
}
