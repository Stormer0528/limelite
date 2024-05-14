export function addAccount(ADD_ACCOUNT) {
  return {type: "ADD_ACCOUNT", ADD_ACCOUNT};
}
export function setStartDateFilter(startDateFilter) {
  return {type: "SET_START_DATE_FILTER", startDateFilter};
}
export function setEndDateFilter(endDateFilter) {
  return {type: "SET_END_DATE_FILTER", endDateFilter};
}
export function setMemoFilter(memoFilter) {
  return {type: "SET_MEMO_FILTER", memoFilter};
}
export function setTypeFilter(typeFilter) {
  return {type: "SET_TYPE_FILTER", typeFilter};
}
export function setReconciledFilter(reconciledFilter) {
  return {type: "SET_RECONCILED_FILTER", reconciledFilter};
}
