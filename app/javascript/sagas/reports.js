import {put, select, call, takeEvery} from "redux-saga/effects";
import {camelCaseKeys} from "../utils";
import {format} from "date-fns/esm";
import isDate from "lodash/isDate";
import isArray from "lodash/isArray";
// Graphql
import {authenticityToken} from "../utils";
import {ApolloClient} from "apollo-client";
import {createHttpLink} from "apollo-link-http";
import {InMemoryCache} from "apollo-cache-inmemory";
// GQL Queries
import RunBalanceSheetMutation from "../graphql/mutations/run_balance_sheet_report.gql";
import runComparativeBalanceSheetMutation from "../graphql/mutations/run_comparative_balance_sheet_report.gql";
import runProfitAndLossReportMutation from "../graphql/mutations/run_profit_and_loss_report.gql";
import runComparativeProfitAndLossMutation from "../graphql/mutations/run_comparative_profit_and_loss_report.gql";
import runMonthProfitAndLossReportMutation from "../graphql/mutations/run_monthly_profit_and_loss_report.gql";
import runCashFlowReportMutation from "../graphql/mutations/run_cash_flow_report.gql";
import runMonthlyCashFlowReportMutation from "../graphql/mutations/run_monthly_cash_flow_report.gql";
import runVendor1099Mutation from "../graphql/mutations/run_vendor_1099_report.gql";
import runVendorMutation from "../graphql/mutations/run_vendor_report.gql";
import runApAgingReportMutation from "../graphql/mutations/run_ap_aging_report.gql";
import runArAgingReportMutation from "../graphql/mutations/run_ar_aging_report.gql";
import runBudgetVsActualReportMutation from "../graphql/mutations/run_budget_vs_actual_report.gql";

import introspectionQueryResultData from "../fragments.json";
import {IntrospectionFragmentMatcher} from "apollo-cache-inmemory";
import CashFlowQuery from "../graphql/queries/load_cash_flow_report.gql";
import MonthlyCashFlowQuery from "../graphql/queries/load_monthly_cash_flow_report.gql";
import Vendor1099Query from "../graphql/queries/load_vendor_1099_report.gql";
import VendorQuery from "../graphql/queries/load_vendor_report.gql";
import ProfitLossQuery from "../graphql/queries/load_profit_and_loss_statement.gql";
import ComparativeProfitLossQuery from "../graphql/queries/load_comparative_profit_and_loss_statement.gql";
import MonthlyProfitLossQuery from "../graphql/queries/load_monthly_profit_and_loss_statement.gql";
import BalanceSheetQuery from "../graphql/queries/load_balance_sheet.gql";
import ComparativeBalanceSheetQuery from "../graphql/queries/load_comparative_balance_sheet.gql";
import ApAgingReportsQuery from "../graphql/queries/load_ap_aging_report.gql";
import ArAgingReportsQuery from "../graphql/queries/load_ar_aging_report.gql";
import budgetVsActualReportQuery from "../graphql/queries/load_budget_vs_actual_report.gql";

// Set up client for graphql
const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData,
});

const client = new ApolloClient({
  link: createHttpLink({
    uri: "/graphql",
    headers: {
      "X-CSRF-Token": authenticityToken(),
    },
    credentials: "same-origin",
  }),
  cache: new InMemoryCache({fragmentMatcher}),
});

export default function* runReports() {
  yield takeEvery("RUN_AP_AGING_REPORT", runApAgingReport);
  yield takeEvery("LOAD_AP_AGING_REPORT", loadApAgingReport);
  yield takeEvery("RUN_AR_AGING_REPORT", runArAgingReport);
  yield takeEvery("LOAD_AR_AGING_REPORT", loadArAgingReport);
  yield takeEvery("RUN_BALANCE_SHEET_REPORT", runBalanceSheetReport);
  yield takeEvery(
    "RUN_COMPARATIVE_BALANCE_SHEET_REPORT",
    runComparativeBalanceSheetReport
  );
  yield takeEvery(
    "LOAD_COMPARATIVE_BALANCE_SHEET_REPORT",
    loadComparativeBalanceSheetReport
  );
  yield takeEvery("VALIDATE_BALANCE_SHEET_REPORT", validateBalanceSheetReport);
  yield takeEvery("LOAD_BALANCE_SHEET_REPORT", loadBalanceSheetReport);
  yield takeEvery("RUN_CASH_FLOW_REPORT", runCashFlowReport);
  yield takeEvery("LOAD_CASH_FLOW_REPORT", loadCashFlowReport);
  yield takeEvery("RUN_MONTHLY_CASH_FLOW_REPORT", runMonthlyCashFlowReport);
  yield takeEvery("LOAD_MONTHLY_CASH_FLOW_REPORT", loadMonthlyCashFlowReport);
  yield takeEvery("RUN_PROFIT_AND_LOSS_REPORT", runProfitAndLossReport);
  yield takeEvery("LOAD_PROFIT_AND_LOSS_REPORT", loadProfitAndLossReport);
  yield takeEvery(
    "RUN_COMPARATIVE_PROFIT_AND_LOSS_REPORT",
    runComparativeProfitAndLossReport
  );
  yield takeEvery(
    "LOAD_COMPARATIVE_PROFIT_AND_LOSS_REPORT",
    loadComparativeProfitAndLossReport
  );
  yield takeEvery("RUN_VENDOR_1099_REPORT", runVendor1099Report);
  yield takeEvery("LOAD_VENDOR_1099_REPORT", loadVendor1099Report);
  yield takeEvery("RUN_VENDOR_REPORT", runVendorReport);
  yield takeEvery("LOAD_VENDOR_REPORT", loadVendorReport);
  yield takeEvery(
    "RUN_MONTHLY_PROFIT_AND_LOSS_REPORT",
    runMonthlyProfitAndLossReport
  );
  yield takeEvery(
    "LOAD_MONTHLY_PROFIT_AND_LOSS_REPORT",
    loadMonthlyProfitAndLossReport
  );
  yield takeEvery("RUN_BUDGET_VS_ACTUAL_REPORT", runBudgetVsActualReport);
  yield takeEvery("LOAD_BUDGET_VS_ACTUAL_REPORT", loadBudgetVsActualReport);
}

function* loadCashFlowReport() {
  yield put({type: "report/setLoading", payload: true});
  const {
    data: {cashFlowReport: payload},
  } = yield client.query({
    query: CashFlowQuery,
  });

  yield put({
    type: "report/mergeReport",
    payload: {
      ...payload,
      account: accountCodes(payload),
    },
  });
  yield put({type: "report/setLoading", payload: false});
}

function* runCashFlowReport() {
  const {
    report: {endDate, startDate, account},
  } = yield select((state) => state);

  yield put({type: "report/setLoading", payload: true});
  const {
    data: {createCashFlowReport: payload},
  } = yield client.mutate({
    mutation: runCashFlowReportMutation,
    variables: {
      account: camelCaseKeys(account),
      end_date: endDate,
      start_date: startDate,
    },
  });

  yield put({
    type: "report/mergeReport",
    payload: {
      ...payload,
      account: accountCodes(payload),
    },
  });
  yield put({type: "report/setLoading", payload: false});
}

function* runBalanceSheetReport() {
  yield put({type: "report/setLoading", payload: true});
  const valid = yield call(validateBalanceSheetReport);

  const {
    report: {endDate, startDate, account, notes},
  } = yield select((state) => state);

  if (valid) {
    const {
      data: {createBalanceSheet: payload},
    } = yield client.mutate({
      mutation: RunBalanceSheetMutation,
      variables: {
        account: camelCaseKeys(account),
        end_date: endDate,
        start_date: startDate,
        notes,
      },
    });
    yield put({type: "report/mergeReport", payload});
    yield put({type: "report/setLoading", payload: false});
  } else {
    yield put({type: "report/setLoading", payload: false});
  }
}

function* runComparativeBalanceSheetReport() {
  yield put({type: "report/setLoading", payload: true});
  const valid = yield call(validateBalanceSheetReport);

  const {
    report: {endDate, startDate, account, notes},
  } = yield select((state) => state);

  if (valid) {
    const {
      data: {createComparativeBalanceSheet: payload},
    } = yield client.mutate({
      mutation: runComparativeBalanceSheetMutation,
      variables: {
        account: camelCaseKeys(account),
        end_date: endDate,
        start_date: startDate,
        notes,
      },
    });
    yield put({type: "report/mergeReport", payload});
    yield put({type: "report/setLoading", payload: false});
  } else {
    yield put({type: "report/setLoading", payload: false});
  }
}

function* validateBalanceSheetReport() {
  const {
    report: {endDate},
  } = yield select((state) => state);

  let errors = 0;

  if (!endDate) {
    yield put({type: "report/setError", payload: "Must include end date"});
    errors++;
  }

  const hasErrors = errors === 0;
  yield put({type: "report/setValid", payload: hasErrors});

  return hasErrors;
}

function* loadBalanceSheetReport() {
  const {
    data: {balanceSheet: payload},
  } = yield client.query({
    query: BalanceSheetQuery,
  });

  yield put({
    type: "report/mergeReport",
    payload: {...payload, account: accountCodes(payload)},
  });
}

function* loadComparativeBalanceSheetReport() {
  const {
    data: {comparativeBalanceSheet: payload},
  } = yield client.query({
    query: ComparativeBalanceSheetQuery,
  });

  yield put({
    type: "report/mergeReport",
    payload: {...payload, account: accountCodes(payload)},
  });
}

function* runProfitAndLossReport() {
  yield put({type: "report/setLoading", payload: true});
  const valid = yield call(validateBalanceSheetReport);

  const {
    report: {endDate, startDate, account},
  } = yield select((state) => state);

  if (valid) {
    const {
      data: {createProfitAndLossStatement: payload},
    } = yield client.mutate({
      mutation: runProfitAndLossReportMutation,
      variables: {
        account: camelCaseKeys(account),
        end_date: endDate,
        start_date: startDate,
        save: true,
      },
    });

    yield put({type: "report/loadReport", payload});
    yield put({
      type: "report/mergeReport",
      payload: {account: accountCodes(payload)},
    });
  } else {
    yield put({type: "report/setLoading", payload: false});
  }
}

function* loadProfitAndLossReport() {
  const {
    data: {profit_and_loss_statement: payload},
  } = yield client.query({
    query: ProfitLossQuery,
  });

  yield put({type: "report/loadReport", payload});
  yield put({
    type: "report/mergeReport",
    payload: {account: accountCodes(payload)},
  });
}

function* runComparativeProfitAndLossReport() {
  yield put({type: "report/setLoading", payload: true});
  const valid = yield call(validateBalanceSheetReport);

  const {
    report: {endDate, startDate, account},
  } = yield select((state) => state);

  if (valid) {
    const {
      data: {createComparativeProfitAndLossStatement: payload},
    } = yield client.mutate({
      mutation: runComparativeProfitAndLossMutation,
      variables: {
        account: camelCaseKeys(account),
        end_date: endDate,
        start_date: startDate,
        save: true,
      },
    });

    yield put({type: "report/loadReport", payload});
    yield put({
      type: "report/mergeReport",
      payload: {account: accountCodes(payload)},
    });
  } else {
    yield put({type: "report/setLoading", payload: false});
  }
}

function* loadComparativeProfitAndLossReport() {
  const {
    data: {comparative_profit_and_loss_statement: payload},
  } = yield client.query({
    query: ComparativeProfitLossQuery,
  });

  yield put({type: "report/loadReport", payload});
  yield put({
    type: "report/mergeReport",
    payload: {account: accountCodes(payload)},
  });
}

function* runMonthlyProfitAndLossReport() {
  yield put({type: "report/setLoading", payload: true});
  const valid = yield call(validateBalanceSheetReport);

  const {
    report: {endDate, startDate, account},
  } = yield select((state) => state);

  if (valid) {
    const {
      data: {createMonthlyProfitAndLossStatement: payload},
    } = yield client.mutate({
      mutation: runMonthProfitAndLossReportMutation,
      variables: {
        account: camelCaseKeys(account),
        end_date: endDate,
        start_date: startDate,
        save: true,
      },
    });

    yield put({
      type: "report/loadReport",
      payload: {...payload, account: accountCodes(payload)},
    });
  } else {
    yield put({type: "report/setLoading", payload: false});
  }
}

function* loadMonthlyProfitAndLossReport() {
  const {
    data: {monthly_profit_and_loss_statement: payload},
  } = yield client.query({
    query: MonthlyProfitLossQuery,
  });

  yield put({
    type: "report/loadReport",
    payload,
  });
  yield put({
    type: "report/mergeReport",
    payload: {account: accountCodes(payload)},
  });
}

function* runMonthlyCashFlowReport() {
  const {
    report: {endDate, id, startDate, account},
  } = yield select((state) => state);

  yield put({type: "report/setLoading", payload: true});
  const {
    data: {createMonthlyCashFlowReport: payload},
  } = yield client.mutate({
    mutation: runMonthlyCashFlowReportMutation,
    variables: {
      account: camelCaseKeys(account),
      end_date: endDate,
      id,
      start_date: startDate,
    },
  });

  yield put({
    type: "report/mergeReport",
    payload: {...payload, account: accountCodes(payload)},
  });
  yield put({type: "report/setLoading", payload: false});
}

function* loadMonthlyCashFlowReport() {
  const {
    data: {monthly_cash_flow_report: payload},
  } = yield client.query({
    query: MonthlyCashFlowQuery,
  });
  yield put({
    type: "report/mergeReport",
    payload: {...payload, account: accountCodes(payload)},
  });
  yield put({type: "report/setLoading", payload: false});
}

function* runVendor1099Report() {
  const {
    report: {endDate, startDate},
  } = yield select((state) => state);

  yield put({type: "report/setLoading", payload: true});
  const {
    data: {createVendor1099Report: payload},
  } = yield client.mutate({
    mutation: runVendor1099Mutation,
    variables: {
      end_date: endDate,
      start_date: startDate,
    },
  });

  yield put({type: "report/mergeReport", payload});
  yield put({type: "report/setLoading", payload: false});
}

function* loadVendor1099Report() {
  const {
    data: {vendor1099Report: payload},
  } = yield client.query({
    query: Vendor1099Query,
  });
  yield put({type: "report/mergeReport", payload});
  yield put({type: "report/setLoading", payload: false});
}

function* runVendorReport() {
  const {
    report: {endDate, startDate},
  } = yield select((state) => state);

  yield put({type: "report/setLoading", payload: true});
  const {
    data: {createVendorReport: payload},
  } = yield client.mutate({
    mutation: runVendorMutation,
    variables: {
      end_date: endDate,
      start_date: startDate,
    },
  });

  yield put({type: "report/mergeReport", payload});
  yield put({type: "report/setLoading", payload: false});
}

function* loadVendorReport() {
  const {
    data: {vendorReport: payload},
  } = yield client.query({
    query: VendorQuery,
  });

  yield put({type: "report/mergeReport", payload});
  yield put({type: "report/setLoading", payload: false});
}

function* runApAgingReport() {
  const {
    report: {
      endDate,
      startDate,
      daysPerPeriod = 30,
      showActiveColumns = false,
      showActiveRows = false,
      periods = 3,
    },
  } = yield select((state) => state);

  yield put({type: "report/setLoading", payload: true});
  const {
    data: {createApAgingReport: payload},
  } = yield client.mutate({
    mutation: runApAgingReportMutation,
    variables: {
      endDate,
      startDate,
      daysPerPeriod: parseInt(daysPerPeriod),
      showActiveColumns,
      showActiveRows,
      periods: parseInt(periods),
    },
  });

  const periodsByVendor = JSON.parse(payload.periodsByVendor || {});
  const vendorsByPeriod = JSON.parse(payload.vendorsByPeriod || {});

  yield put({
    type: "report/mergeReport",
    payload: Object.assign({}, payload, {periodsByVendor, vendorsByPeriod}),
  });
  yield put({type: "report/setLoading", payload: false});
}

function* loadApAgingReport() {
  yield put({type: "report/setLoading", payload: true});
  const {
    data: {
      ap_aging_report: payload,
      ap_aging_report: {
        periodsByVendor: periodsByVendorStr = "",
        vendorsByPeriod: vendorsByPeriodStr = "",
      } = {},
    } = {},
  } = yield client.query({
    query: ApAgingReportsQuery,
  });

  const periodsByVendor = JSON.parse(periodsByVendorStr);
  const vendorsByPeriod = JSON.parse(vendorsByPeriodStr);

  yield put({
    type: "report/mergeReport",
    payload: Object.assign({}, payload, {periodsByVendor, vendorsByPeriod}),
  });

  yield put({type: "report/setLoading", payload: false});
}

function* loadArAgingReport() {
  yield put({type: "report/setLoading", payload: true});
  const {
    data: {
      ar_aging_report: payload,
      ar_aging_report: {
        customersByPeriod: customersByPeriodStr = "",
        periodsByCustomer: periodsByCustomerStr = "",
      } = {},
    } = {},
  } = yield client.query({
    query: ArAgingReportsQuery,
  });

  const periodsByCustomer = JSON.parse(periodsByCustomerStr);
  const customersByPeriod = JSON.parse(customersByPeriodStr);

  yield put({
    type: "report/mergeReport",
    payload: Object.assign({}, payload, {periodsByCustomer, customersByPeriod}),
  });

  yield put({type: "report/setLoading", payload: false});
}

function* runArAgingReport() {
  const {
    report: {
      endDate,
      startDate,
      daysPerPeriod = 30,
      showActiveColumns = false,
      showActiveRows = false,
      periods = 3,
    },
  } = yield select((state) => state);

  yield put({type: "report/setLoading", payload: true});
  const {
    data: {
      createArAgingReport: payload,
      createArAgingReport: {
        customersByPeriod: customersByPeriodStr = "",
        periodsByCustomer: periodsByCustomerStr = "",
      } = {},
    },
  } = yield client.mutate({
    mutation: runArAgingReportMutation,
    variables: {
      endDate,
      startDate,
      daysPerPeriod: parseInt(daysPerPeriod),
      showActiveColumns,
      showActiveRows,
      periods: parseInt(periods),
    },
  });

  const periodsByCustomer = JSON.parse(periodsByCustomerStr);
  const customersByPeriod = JSON.parse(customersByPeriodStr);

  yield put({
    type: "report/mergeReport",
    payload: Object.assign({}, payload, {periodsByCustomer, customersByPeriod}),
  });
  yield put({type: "report/setLoading", payload: false});
}

function* runBudgetVsActualReport() {
  const {
    report: {endDate, startDate, account},
  } = yield select((state) => state);

  const formattedStartDate = isDate(startDate)
    ? format(startDate, "yyyy-MM-dd")
    : startDate;
  const formattedEndDate = isDate(endDate)
    ? format(endDate, "yyyy-MM-dd")
    : endDate;

  yield put({type: "report/setLoading", payload: true});

  const {
    data: {report: payload},
  } = yield client.mutate({
    mutation: runBudgetVsActualReportMutation,
    variables: {
      endDate: formattedEndDate,
      startDate: formattedStartDate,
      account,
    },
  });

  yield put({type: "report/loadReport", payload});
  yield put({
    type: "report/mergeReport",
    payload: {account: accountCodes(payload)},
  });
}

function* loadBudgetVsActualReport() {
  const {
    data: {report: payload},
  } = yield client.query({
    query: budgetVsActualReportQuery,
  });

  const data = JSON.parse(payload.data);

  yield put({type: "report/loadReport", payload: payload || {}});
  yield put({
    type: "report/mergeReport",
    payload: {
      account: normalizeArrayValues(
        camelCaseKeys(data["account_search_params"] || {})
      ),
    },
  });
}

// Helper Functions
//------------------------------------------------------------------------------
function accountCodes({
  accountFund = [],
  accountFunction = [],
  accountGoal = [],
  accountLocation = [],
  accountObject = [],
  accountResource = [],
  accountYear = [],
}) {
  return {
    fundCode: accountFund.map(({code}) => code).join(",") || null,
    functionCode: accountFunction.map(({code}) => code).join(",") || null,
    goalCode: accountGoal.map(({code}) => code).join(",") || null,
    locationCode: accountLocation.map(({code}) => code).join(",") || null,
    objectCode: accountObject.map(({code}) => code).join(",") || null,
    resourceCode: accountResource.map(({code}) => code).join(",") || null,
    yearCode: accountYear.map(({code}) => code).join(",") || null,
  };
}

function normalizeArrayValues(accountElements) {
  let ret = {};
  Object.entries(accountElements).map(([key, value]) => {
    ret[key] = isArray(value) ? value.join(", ") : value;
  });
  return ret;
}
