import {connect} from "react-redux";
import {compose} from "redux";

import {graphql} from "react-apollo";
import isEqual from "lodash/isEqual";
import produce from "immer";
import {eventHandlers as DateHandlers} from "../../shared/date_range_toggle";
import {eventHandlers as AmountHandlers} from "../../shared/amount_toggle";
import InitialItemQuery from "../../../graphql/queries/bank_account_search_connection.gql";

// Components
import Ledger from "./ledger";

const mapStateToProps = (state, props) => {
  const {
    bank: {filter, ui},
  } = state;

  const {
    bank_account,
    itemQuery: {
      error = null,
      loading,
      fetchMore = function() {},
      refetch,
      variables: {cursor, first, ...restVars},
      bankItemConnection: {edges: items = [], pageInfo = {}} = {},
    },
  } = props;

  // Get More items
  if (!error) {
    if (!isEqual(filter, restVars)) {
      refetch(Object.assign({}, filter, {bank_account_id: bank_account.id}));
    } else if (!pageInfo.hasNextPage) {
      fetchMore({
        variables: {cursor: pageInfo.endCursor, first: 50},
        updateQuery: (prevProps, nextProps) => {
          const {
            bankItemConnection: {edges: prevEdges},
          } = prevProps;

          return produce(prevProps, draft => {
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
  }
  return {
    filter,
    ui,
    loading: loading || pageInfo.hasNextPage,
    items: items.map(item => item.node),
    print_path: `${
      window.location.pathname
    }/print.pdf?filter=${encodeURIComponent(JSON.stringify({filter, ui}))}`,
    xlsx_path: `${
      window.location.pathname
    }/print.xlsx?filter=${encodeURIComponent(JSON.stringify({filter, ui}))}`,
  };
};

const mapDispatchToProps = dispatch => {
  const {
    bank: {
      setMemoFilter = function() {},
      setTypeFilter = function() {},
      setReconciledFilter = function() {},
      setVendorFilter = function() {},
      setStateFilter = function() {},
      setNumberFilter = function() {},
      setUiDetailView = function() {},
    },
  } = dispatch;

  return {
    ...DateHandlers(dispatch, "bank"),
    /* handleFilterDateToggleChange, handleBeforeDateFilterChange, handleAfterDateFilterChange */
    ...AmountHandlers(dispatch, "bank"),
    /* handleFilterAmountToggleChange handleMaxAmountFilterChange handleMinAmountFilterChange */
    handleMemoChange: ({target: {value}}) => {
      setMemoFilter(value);
    },
    handleTypeChange: ({target: {value}}) => {
      setTypeFilter(value);
    },
    handleReconciledChange: (_e, value) => {
      setReconciledFilter(value);
    },
    handleStateChange: ({target: {value}}) => {
      setStateFilter(value);
    },
    handleVendorChange: (_e, vendor) => {
      const {id} = vendor || {};
      setVendorFilter(id);
    },
    handleNumberChange: ({target: {value}}) => {
      setNumberFilter(value);
    },
    handleToggleSetUiDetailView: ({target: {checked}}) => {
      setUiDetailView(!checked);
    },
    loadItems: id => {
      dispatch({type: "LOAD_BANK_ACCOUNT_ITEMS", id});
    },
  };
};

export default compose(
  graphql(InitialItemQuery, {
    name: "itemQuery",
    variables: {first: 25},
  }),
  connect(mapStateToProps, mapDispatchToProps)
)(Ledger);
