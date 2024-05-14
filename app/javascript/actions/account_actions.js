// Account Actions
//------------------------------------------------------------------------------

export function functions() {
  return {type: "FUNCTIONS"};
}
export function funds() {
  return {type: "FUNDS"};
}
export function goals() {
  return {type: "GOALS"};
}
export function locations() {
  return {type: "LOCATIONS"};
}
export function objects() {
  return {type: "OBJECTS"};
}
export function resources() {
  return {type: "RESOURCES"};
}
export function schools() {
  return {type: "SCHOOLS"};
}
export function years() {
  return {type: "YEARS"};
}

export function contentDidLoad(accounts) {
  return {type: "LOAD_CONTENT", accounts};
}
