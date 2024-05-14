import {useState, useCallback} from "react";
import {compose} from "redux";
import DateWrapper from "../../shared/date_wrapper";
import ThemeWrapper from "../../shared/theme_wrapper";
import {camelCaseKeys} from "../../../utils";
import {Formik} from "formik";
import {useQuery, useMutation} from "@apollo/react-hooks";

import ProfitAndLossStatement from "./profit_and_loss_statement";
// import Loading from "./loading";
// import FormikDebug from "../../shared/formik_debug";

import PROFIT_LOSS_QUERY_BY_RESOURCE from "../../../graphql/queries/load_profit_and_loss_statement_by_resource.gql";
import RUN_PROFIT_AND_LOSS_REPORT_BY_RESOURCE from "../../../graphql/mutations/run_profit_and_loss_report_by_resource.gql";

function Report() {
  // Fix: useQuery#onCompleted fires ever re-render ... so skipping after first rendeer
  const [didFetchInitialData, setInitialDataFetched] = useState(false);
  const [report, setReport] = useState({data: ""});
  const [tabIndex, setTabIndex] = useState("all");

  const {
    error: queryError,
    loading: queryLoading = false,
    data: {report: {startDate = "", endDate = ""} = {}} = {},
  } = useQuery(PROFIT_LOSS_QUERY_BY_RESOURCE, {
    // skip: didFetchInitialData,
    fetchPolicy: "network-only",
    onCompleted: ({report}) => {
      if (!didFetchInitialData) {
        const data = JSON.parse(report.data);
        const {account_elements: account = {}} = data || {};
        setReport({account: camelCaseKeys(account || {}), ...report, data});
        setInitialDataFetched(true);
      }
    },
  });

  queryError && console.error("Query ->", queryError);

  const [runReport, mutation] = useMutation(
    RUN_PROFIT_AND_LOSS_REPORT_BY_RESOURCE,
    {
      onCompleted: ({report}) => {
        const data = JSON.parse(report.data);
        setReport({...report, data});
      },
    }
  );

  const handleTabClick = useCallback(
    (e, index) => {
      setTabIndex(index);
    },
    [setTabIndex]
  );

  const {error: mutationError, loading: mutationLoading} = mutation;
  const loading = queryLoading || mutationLoading;

  mutationError && console.error("Mutation ->", mutationError);

  if (queryLoading || !didFetchInitialData || !report.data) {
    return null;
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
      {({errors, ...formik}) => {
        const {account_elements = {}} = report.data || {};
        const createLinkHandler = (objectCode) => () => {
          const printPath = `/entries?startDate=${encodeURIComponent(
            formik.values.startDate
          )}&endDate=${encodeURIComponent(
            formik.values.endDate
          )}&account=${encodeURIComponent(
            JSON.stringify(
              Object.assign({}, formik.values.account || {}, {objectCode})
            )
          )}`;
          window.open(printPath);
        };

        return (
          <ProfitAndLossStatement
            data={report.data}
            loading={loading}
            {...{tabIndex, handleTabClick, createLinkHandler}}
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
