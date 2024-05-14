import {useState} from "react";
import {compose} from "redux";
import DateWrapper from "../../shared/date_wrapper";
import ThemeWrapper from "../../shared/theme_wrapper";
import {Formik} from "formik";
import {camelCaseKeys} from "../../../utils";

import {useQuery, useMutation} from "@apollo/react-hooks";
import BalanceSheetByMonth from "./balance_sheet";
import Loading from "./loading";

import BALANCE_SHEET_BY_MONTH from "../../../graphql/queries/load_balance_sheet_by_month.gql";
import RUN_BALANCE_SHEET_BY_MONTH from "../../../graphql/mutations/run_balance_sheet_by_month_report.gql";

function Report() {
  // Fix: useQuery#onCompleted fires ever re-render ... so skipping after first rendeer
  const [didFetchInitialData, setInitialDataFetched] = useState(false);
  const [report, setReport] = useState({data: ""});

  const {
    error,
    loading: queryLoading = false,
    data: {report: {startDate = "", endDate = ""} = {}} = {},
  } = useQuery(BALANCE_SHEET_BY_MONTH, {
    // skip: didFetchInitialData,
    fetchPolicy: "network-only",
    onCompleted: ({report = {}}) => {
      if (!didFetchInitialData) {
        const data = JSON.parse(report.data);
        const {account_elements: account} = data || {};
        setReport({account: camelCaseKeys(account), ...report, data});
        setInitialDataFetched(true);
      }
    },
  });

  error && console.error("Query ->", error);

  const [runReport, mutation] = useMutation(RUN_BALANCE_SHEET_BY_MONTH, {
    onCompleted: ({report = {}}) => {
      const data = JSON.parse(report.data || "{}");
      const {account_elements: account} = data || {};
      setReport({account: camelCaseKeys(account), ...report, data});
    },
  });

  const {error: mutationError, loading: mutationLoading} = mutation;
  const loading = queryLoading || mutationLoading;

  mutationError && console.error("Mutation ->", mutationError);

  if (queryLoading || !didFetchInitialData || !report.data) {
    return <Loading />;
  }

  return (
    <Formik
      initialValues={{
        startDate,
        endDate,
        account:
          (report.data["account_elements"] &&
            camelCaseKeys(report.data["account_elements"])) ||
          {},
      }}
      validateOnChange={false}
      isInitialValid
      onSubmit={async (variables, {setSubmitting, resetForm}) => {
        setSubmitting(true);
        await runReport({
          variables,
        });
        setSubmitting(false);
        resetForm({values: variables});
      }}
    >
      {({values, ...formik}) => {
        const {account_elements = {}} = report.data || {};
        return (
          <BalanceSheetByMonth
            data={report.data}
            loading={loading}
            values={values}
            {...report}
            {...account_elements}
            {...formik}
          />
        );
      }}
    </Formik>
  );
}

// Export
//------------------------------------------------------------------------------
export default compose(ThemeWrapper, DateWrapper)(Report);
