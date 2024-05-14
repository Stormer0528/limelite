/* eslint-disable react/display-name */
import PropTypes from "prop-types";
import {useQuery} from "@apollo/react-hooks";

import {makeStyles} from "@material-ui/styles";
import LinearProgress from "@material-ui/core/LinearProgress";
import Fade from "@material-ui/core/Fade";

import STATEMENTS_QUERY from "@graphql/queries/statements.gql";

import Statements from "./statements";
const StatementsContainer = ({slug}) => {
  const {loading, data: {statementSearch: statements = []} = {}} = useQuery(
    STATEMENTS_QUERY,
    {
      fetchPolicy: "network-only",
      variables: {slug, statementableType: "CreditCard"},
    }
  );
  const cl = useStyles();

  if (loading) {
    return (
      <LinearProgress
        color="primary"
        classes={{
          colorPrimary: cl.progressBar,
        }}
        className={cl.progress}
      />
    );
  }

  return (
    <Fade in>
      <Statements
        statements={statements}
        newPath={`/credit_cards/${slug}/reconciliations/new`}
      />
    </Fade>
  );
};

const useStyles = makeStyles(() => ({
  progress: {
    height: "2px",
  },
  progressBar: {
    background: "#43A047",
  },
}));

StatementsContainer.propTypes = {
  slug: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default StatementsContainer;
