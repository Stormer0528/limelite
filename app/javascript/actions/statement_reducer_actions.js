// StatementReducer Actions
//------------------------------------------------------------------------------

export function setEndingBalance(ending_balance) {
  return {type: "SET_ENDING_BALANCE", ending_balance};
}
export function setStartedAt(started_at) {
  return {type: "SET_STARTED_AT", started_at};
}
export function setEndedAt(ended_at) {
  return {type: "SET_ENDED_AT", ended_at};
}
export function setTypeFilter(type_filter) {
  return {type: "SET_TYPE_FILTER", type_filter};
}
export function setItems(items) {
  return {type: "SET_ITEMS", items};
}
export function selectItem({id, type, amount_in_cents}) {
  return {
    type: "SELECT_ITEM",
    id,
    item_type: type,
    amount_in_cents,
  };
}
export function unselectItem({id, type, amount_in_cents}) {
  return {
    type: "UNSELECT_ITEM",
    id,
    item_type: type,
    amount_in_cents,
  };
}
export function saveStatement({
  statement_id,
  statement_balance,
  statementable_id,
  statementable_type = "BankAccount",
  state_action = "save_draft",
}) {
  return {
    type: "SAVE_STATEMENT",
    statement_id,
    statementable_id,
    statementable_type,
    statement_balance,
    state_action,
  };
}
