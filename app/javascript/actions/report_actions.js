// Report Actions
//------------------------------------------------------------------------------

export function runCashFlowReport() {
  return {type: "RUN_CASH_FLOW_REPORT"};
}

export function saveCashFlowReport() {
  return {type: "RUN_CASH_FLOW_REPORT", save: true};
}

export function runBalanceSheetReport() {
  return {type: "RUN_BALANCE_SHEET_REPORT"};
}

export function saveBalanceSheetReport() {
  return {type: "RUN_BALANCE_SHEET_REPORT", save: true};
}

export function runComparativeBalanceSheetReport() {
  return {type: "RUN_COMPARATIVE_BALANCE_SHEET_REPORT"};
}

export function saveComparativeBalanceSheetReport() {
  return {type: "RUN_COMPARATIVE_BALANCE_SHEET_REPORT", save: true};
}

export function runProfitAndLossReport() {
  return {type: "RUN_PROFIT_AND_LOSS_REPORT"};
}

export function saveProfitAndLossReport() {
  return {type: "RUN_PROFIT_AND_LOSS_REPORT", save: true};
}
