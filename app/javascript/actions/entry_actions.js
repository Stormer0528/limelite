// Entry Actions
//------------------------------------------------------------------------------
//
// TODO remove entry memo
// TODO add entry_item memos
//

export function set_fundId(fund_id) {
  return {type: "SET_FUND_ID", fund_id};
}

export function set_functionId(function_id) {
  return {type: "SET_FUNCTION_ID", function_id};
}

export function set_locationId(location_id) {
  return {type: "SET_LOCATION_ID", location_id};
}

export function set_yearId(year_id) {
  return {type: "SET_YEAR_ID", year_id};
}

export function set_goalId(goal_id) {
  return {type: "SET_GOAL_ID", goal_id};
}

export function set_objectId(object_id) {
  return {type: "SET_OBJECT_ID", object_id};
}

export function set_resourceId(resource_id) {
  return {type: "SET_RESOURCE_ID", resource_id};
}

export function set_date(date) {
  return {type: "SET_DATE", date};
}

export function set_debit(debit) {
  return {type: "SET_DEBIT", debit};
}

export function set_credit(credit) {
  return {type: "SET_CREDIT", credit};
}

export function set_entry_type(entry_type) {
  return {type: "SET_ENTRY_TYPE", entry_type};
}

export function set_memo(memo) {
  return {type: "SET_MEMO", memo};
}

export function createEntry({mutate}) {
  return {type: "CREATE_ENTRY", mutate};
}

export function findAccountByCode() {
  return {type: "FIND_ACCOUNTS_BY_CODE"};
}

export function setCurrentItemCode(account) {
  return {type: "SET_CURRENT_ITEM_ACCOUNT", account};
}

export function addCredit() {
  return {type: "ADD_CREDIT"};
}

export function addDebit() {
  return {type: "ADD_DEBIT"};
}

export function setEntryType(entry_type) {
  return {type: "SET_ENTRY_TYPE", entry_type};
}

export function setFinalPayment(finalPayment) {
  return {type: "SET_FINAL_PAYMENT", finalPayment};
}

export function toggleFinalPayment() {
  return {type: "TOGGLE_FINAL_PAYMENT"};
}

export function validateItemCode({
  id,
  fundCode,
  functionCode,
  goalCode,
  locationCode,
  objectCode,
  resourceCode,
  yearCode,
}) {
  return {
    type: "VALIDATE_ITEM_CODE",
    id,
    fundCode,
    functionCode,
    goalCode,
    locationCode,
    objectCode,
    resourceCode,
    yearCode,
  };
}

// ENTRY ITEMS
//------------------------------------------------------------------------------
export function setEntryItemType({id, entry_type}) {
  return {type: "SET_ENTRY_ITEM_TYPE", id, entry_type};
}

export function setEntryItemAmount({id, amount}) {
  return {type: "SET_ENTRY_ITEM_AMOUNT", id, amount};
}

export function deleteEntryItem(id) {
  return {type: "DELETE_ENTRY_ITEM", id};
}

export function setCurrentEntryIndex(current_entry_index) {
  return {type: "SET_CURRENT_ENTRY_INDEX", current_entry_index};
}

export function createNewAccount({id, name, budget, number}) {
  return {type: "CREATE_NEW_ACCOUNT", id, name, budget, number};
}
