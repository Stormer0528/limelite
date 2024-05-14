import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core/styles";
import {useQuery} from "@apollo/react-hooks";
import produce from "immer";

// Components
import TopBar from "./top_bar";
import Breadcrumb from "./breadcrumb";

import {useFormikContext} from "formik";

import Divider from "@material-ui/core/Divider";
import Ledger from "./ledger";
import BANK_ITEM_QUERY from "@graphql/queries/check_register_report.gql";

// import Debug from "@shared/formik_debug";

const CheckRegister = ({fundCodes = [], classes = {}}) => {
  const {
    values: {
      approved,
      reconciled,
      type = "Check",
      memo,
      bank_account_id,
      vendor_id,
      afterDate: start_date,
      beforeDate: end_date,
      minAmount: min_amount,
      maxAmount: max_amount,
    },
  } = useFormikContext();

  /* See Also: top_bar.js for refetch variables used when report is resubmitted  */
  const queryVars = {
    bank_account_id,
    start_date,
    end_date,
    min_amount,
    max_amount,
    reconciled,
    approved,
    type,
    memo,
    vendor_id,
  };

  const {
    loading,
    data: {bankItemConnection: {pageInfo = {}, edges: items = []} = {}} = {},
    fetchMore,
    refetch,
  } = useQuery(BANK_ITEM_QUERY, {
    ...queryVars,
    type: "Check",
    first: 50,
  });

  if (pageInfo.hasNextPage) {
    fetchMore({
      variables: {cursor: pageInfo.endCursor, first: 50},
      updateQuery: (prevProps, nextProps) => {
        const {
          bankItemConnection: {edges: prevEdges},
        } = prevProps;

        return produce(prevProps, (draft) => {
          const {
            fetchMoreResult: {
              bankItemConnection: {edges, pageInfo},
            },
          } = nextProps;

          draft.bankItemConnection.edges = [...prevEdges, ...edges];
          draft.bankItemConnection.pageInfo = pageInfo;
        });
      },
    });
  }

  return (
    <section
      className={`CheckRegisterReport react-inputs ${classes.container}`}
    >
      <Breadcrumb />

      <TopBar {...{loading, refetch, queryVars}} />

      <Divider />
      <Ledger {...{fundCodes, loading: false, items}} />
    </section>
  );
};

CheckRegister.propTypes = {
  fundCodes: PropTypes.arrayOf(PropTypes.string),
  reportPeriod: PropTypes.string,
  startDate: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  endDate: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  data: PropTypes.object,
  ui: PropTypes.object,
  pdfUrl: PropTypes.string,
  xlsxUrl: PropTypes.string,
  bankAccounts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
    })
  ),
  errors: PropTypes.array,
  valid: PropTypes.bool,
  persisted: PropTypes.bool,
  organizationName: PropTypes.string,
  updatedAt: PropTypes.string,
  classes: PropTypes.object.isRequired,
};

const styles = () => ({
  container: {
    marginTop: "150px",
  },
});

// Export
//------------------------------------------------------------------------------
export default withStyles(styles)(CheckRegister);
