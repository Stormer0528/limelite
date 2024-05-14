import {connect} from "react-redux";
import {compose} from "redux";
import {graphql} from "react-apollo";
import isEmpty from "lodash/isEmpty";
import isEqual from "lodash/isEqual";
import uniqBy from "lodash/uniqBy";
import produce from "immer";

import EntryItemsQuery from "../../../../graphql/queries/entry_items.gql";
import EntriesTable from "./table";

const mapStateToProps = (
  {
    account,
    filter: {
      filter: {
        aasm_state,
        type,
        entry_type,
        journalable_type,
        start_date,
        end_date,
        min_amount,
        max_amount,
        memo,
      } = {},
    } = {},
  },
  props
) => {
  const {entryItemsQuery = {}, customer_id} = props;

  // Assign GQL Functions/Vars
  //----------------------------------------------------------------------------
  const {
    loading,
    fetchMore = function() {},
    refetch = function() {},
    entryItemsSearchConnection: {
      nodes: entries = [],
      pageInfo: {hasNextPage, endCursor} = {},
    } = {},
    // Note: Don't remove cursor and first here. Removing for comparison later
    variables: {cursor, first, ...restVars} = {},
  } = entryItemsQuery;

  const filterVars = {
    account,
    aasm_state,
    type,
    entry_type,
    journalable_type,
    start_date,
    end_date,
    min_amount: isEmpty(min_amount) ? null : min_amount.replace(/\./, ""),
    max_amount: isEmpty(max_amount) ? null : max_amount.replace(/\./, ""),
    memo,
    customer_id,
  };

  // Run Update/Paging Query
  //----------------------------------------------------------------------------
  if (!isEqual(filterVars, restVars)) {
    refetch(Object.assign({}, filterVars, {first: 2500}));
  }

  return {
    loading,
    entries,
  };
};

export default compose(
  graphql(EntryItemsQuery, {
    name: "entryItemsQuery",
    options: props => {
      const {customer_id, account} = props;
      return {
        variables: {
          first: 250,
          customer_id,
          account,
        },
      };
    },
  }),
  connect(mapStateToProps)
)(EntriesTable);

// Helper Functions
//------------------------------------------------------------------------------
const mergeFunc = query => (prevProps = {}, nextProps = {}) => {
  const {
    [query]: {nodes: prevNodes = [], pageInfo: prevPageInfo = {}} = {},
  } = prevProps;
  const {
    fetchMoreResult: {
      [query]: {pageInfo: nextPageInfo},
    },
  } = nextProps;

  return prevPageInfo.endCursor === nextPageInfo.endCursor
    ? prevProps
    : produce(prevProps, draft => {
        const {
          fetchMoreResult: {[query]: {nodes = [], pageInfo}} = {},
        } = nextProps;

        draft[query].nodes = uniqBy([...prevNodes, ...nodes], "id");
        draft[query].pageInfo = pageInfo;
      });
};
