import {withFormik, useFormikContext} from "formik";
import {useQuery} from "@apollo/react-hooks";
import {Helmet} from "react-helmet";
import Paper from "@material-ui/core/Paper";
import AccountStatus from "./account_status";
import StatementsTable from "./statements_table";

import RECONCILIATIONS_QUERY from "../../../graphql/queries/reconciliations.gql";

const StatementsIndex = () => {
  const {
    values: {statementableId, statementableType} = {},
  } = useFormikContext();

  const {
    data: {reconciliations = []} = {},
    loading: formLoading,
    variables,
    refetch,
  } = useQuery(RECONCILIATIONS_QUERY, {
    variables: {
      statementableId,
      statementableType,
    },
  });

  return (
    <Paper style={{flexGrow: 1, display: "flex", flexDirection: "column"}}>
      <Helmet>
        <title>LimeLite DS :: Reconciliations</title>
      </Helmet>

      <AccountStatus />
      <StatementsTable
        {...{
          reconciliations,
          variables,
          refetch,
          loading: formLoading,
        }}
      />
    </Paper>
  );
};

export default withFormik({
  mapPropsToValues: () => ({statementableId: ""}),
})(StatementsIndex);
