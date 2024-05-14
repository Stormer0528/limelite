import {compose} from "redux";
import {connect} from "react-redux";
import {graphql} from "react-apollo";
import statementsQuery from "../../../../graphql/queries/statements.gql";

// Components
//------------------------------------------------------------------------------
import Statements from "./statements";

const mapStateToProps = ({statement: {fiscalYear} = {}}) => {
  return {fiscalYear};
};

export default compose(
  connect(mapStateToProps),
  graphql(statementsQuery, {
    name: "statementQuery",
    props: ({
      statementQuery: {loading, statementSearch: statements = []} = {},
    }) => {
      return {loading, statements};
    },

    options: ({account_id, fiscalYear}) => ({
      fetchPolicy: "network-only",
      variables: {
        slug: account_id,
        statementableType: "BankAccount",
        fiscalYear,
      },
    }),
  })
)(Statements);
