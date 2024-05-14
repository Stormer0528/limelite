// ApAgingReports Actions
//------------------------------------------------------------------------------

export function setStartDate(startDate) {
  return {type: "SET_START_DATE", startDate};
}
export function setEndDate(endDate) {
  return {type: "SET_END_DATE", endDate};
}
export function setPeriod(period) {
  return {type: "SET_PERIOD", period};
}
export function setPeriodNumber(periodNumber) {
  return {type: "SET_PERIOD_NUMBER", periodNumber};
}
export function setAgingPeriodDays(agingPeriodDays) {
  return {type: "SET_AGING_PERIOD_DAYS", agingPeriodDays};
}
