import {connect} from "react-redux";
import {graphql} from "react-apollo";
import {compose} from "redux";
import isEqual from "lodash/isEqual";
import produce from "immer";

import InitialItemQuery from "../../../graphql/queries/credit_card_item_search_connection.gql";

// Components
import Ledger from "./ledger";

const mapStateToProps = (state, props) => {
  const {
    credit_card: {accounts, filter},
  } = state;

  const {
    account,
    itemQuery: {
      loading,
      fetchMore = function () {},
      refetch,
      variables: {cursor, first, ...restVars},
      creditCardItemConnection: {edges: items = [], pageInfo = {}} = {},
    },
  } = props;

  // Get More items
  if (!isEqual(filter, restVars)) {
    refetch(Object.assign({}, filter, {credit_card_id: account.id}));
  } else if (!pageInfo.hasNextPage) {
    fetchMore({
      variables: {cursor: pageInfo.endCursor, first: 50},
      updateQuery: (prevProps, nextProps) => {
        const {
          creditCardItemConnection: {edges: prevEdges},
        } = prevProps;

        return produce(prevProps, (draft) => {
          const {
            fetchMoreResult: {
              creditCardItemConnection: {edges, pageInfo},
            },
          } = nextProps;

          draft.creditCardItemConnection.edges = [...prevEdges, ...edges];
          draft.creditCardItemConnection.pageInfo = pageInfo;
        });
      },
    });
  }

  return {
    accounts,
    account,
    filter,
    loading: loading || pageInfo.hasNextPage,
    items: items.map((item) => item.node),
    history,
    printPath: `${
      window.location.pathname
    }/print.pdf?filter=${encodeURIComponent(JSON.stringify({filter}))}`,
    xlsxPath: `${
      window.location.pathname
    }/print.xlsx?filter=${encodeURIComponent(JSON.stringify({filter}))}`,
  };
};

const mapDispatchToProps = (dispatch) => ({
  updateCurrentPage: ({target: {value: id}}) =>
    (window.location = `/credit_cards/${id}`),
});

export default compose(
  graphql(InitialItemQuery, {
    name: "itemQuery",
    variables: {first: 25},
  }),
  connect(mapStateToProps, mapDispatchToProps)
)(Ledger);
