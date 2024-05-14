import IndexView from "./view";
import {connect} from "react-redux";
import {compose} from "redux";
import {graphql} from "react-apollo";
import isEmpty from "lodash/isEmpty";
import isEqual from "lodash/isEqual";
import uniqBy from "lodash/uniqBy";
import produce from "immer";
import {eventHandlers as AmountHandlers} from "../../../shared/amount_toggle";
import {eventHandlers as DateHandlers} from "../../../shared/date_range_toggle";

import EntriesQuery from "@graphql/queries/entries_connection.gql";
import EntryItemsQuery from "@graphql/queries/entry_items.gql";

const mapStateToProps = (
  {
    index: {
      organization: {id: organization_id},
      filter = {},
      filter: {
        aasm_state,
        type,
        entry_type,
        journalable_type,
        start_date,
        end_date,
        account,
        min_amount,
        max_amount,
        memo,
      } = {},

      ui = {},
      ui: {ledgerView = "summary"} = {},
    },
  },
  {
    entryQuery,
    entryQuery: {entrySearchConnection: {nodes: entries = []} = {}} = {},
    entryItemsQuery,
    entryItemsQuery: {
      entryItemsSearchConnection: {nodes: items = []} = {},
    } = {},
  }
) => {
  // Assign GQL Functions/Vars
  //----------------------------------------------------------------------------
  const {
    loading,
    fetchMore = function () {},
    refetch = function () {},
    [ledgerView === "summary"
      ? "entryItemsSearchConnection"
      : "entrySearchConnection"]: {
      pageInfo: {hasNextPage, endCursor} = {},
    } = {},
    // Note: Don't remove cursor and first here. Removing for comparison later
    variables: {cursor, first, ...restVars} = {},
  } = ledgerView === "summary" ? entryItemsQuery : entryQuery;

  const filterVars = {
    aasm_state,
    type,
    entry_type,
    journalable_type,
    start_date,
    end_date,
    min_amount: isEmpty(min_amount) ? null : min_amount.replace(/\./, ""),
    max_amount: isEmpty(max_amount) ? null : max_amount.replace(/\./, ""),
    memo,
    account,
    organization_id,
  };

  // Merge Props Function
  //----------------------------------------------------------------------------
  const updateQuery = mergeFunc(
    ledgerView === "summary"
      ? "entryItemsSearchConnection"
      : "entrySearchConnection"
  );

  // Run Update/Paging Query
  //----------------------------------------------------------------------------
  if (!isEqual(filterVars, restVars)) {
    refetch(Object.assign({}, filterVars, {organization_id, first: 35}));
  } else if (hasNextPage) {
    fetchMore({
      variables: {cursor: endCursor, first: 500, organization_id},
      updateQuery,
    });
  }

  // State/Props
  //----------------------------------------------------------------------------
  return {
    entries,
    items,
    loading: loading || hasNextPage,
    filter,
    ui,
    print_path: `${
      window.location.pathname
    }/print.pdf?filter=${encodeURIComponent(JSON.stringify({filter, ui}))}`,
    xlsx_path: `${
      window.location.pathname
    }/print.xlsx?filter=${encodeURIComponent(JSON.stringify({filter, ui}))}`,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    ...DateHandlers(dispatch, "index"),
    /* handleFilterDateToggleChange, handleBeforeDateFilterChange, handleAfterDateFilterChange */
    ...AmountHandlers(dispatch, "index"),
    /* handleFilterAmountToggleChange handleMaxAmountFilterChange handleMinAmountFilterChange */

    handleToggleSetUiDetailView: () => {
      dispatch.index.setUiDetailView();
    },
    handleMemoFilterChange: ({target: {value}}) => {
      dispatch.index.setMemoFilter(value);
    },
    handleTypeFilterChange: ({target: {value}}) => {
      dispatch.index.setTypeFilter(value);
    },
    handleEntryTypeFilterChange: ({target: {value}}) => {
      dispatch.index.setEntryTypeFilter(value);
    },
    handleJournalTypeFilterChange: ({target: {value}}) => {
      dispatch.index.setJournalTypeFilter(value);
    },
    handleStateFilterChange: ({target: {value}}) => {
      dispatch.index.setStateFilter(value);
    },
    handleAccountFundChange: ({target: {value}}) => {
      dispatch.index.setAccountFund(value);
    },
    handleAccountResourceChange: ({target: {value}}) => {
      dispatch.index.setAccountResource(value);
    },
    handleAccountYearChange: ({target: {value}}) => {
      dispatch.index.setAccountYear(value);
    },
    handleAccountGoalChange: ({target: {value}}) => {
      dispatch.index.setAccountGoal(value);
    },
    handleAccountFunctionChange: ({target: {value}}) => {
      dispatch.index.setAccountFunction(value);
    },
    handleAccountObjectChange: ({target: {value}}) => {
      dispatch.index.setAccountObject(value);
    },
    handleAccountLocationChange: ({target: {value}}) => {
      dispatch.index.setAccountLocation(value);
    },
  };
};

// Send props to graphql queries
const mapGraphStateToProps = ({
  index: {
    ui: {ledgerView},
    organization: {id: organization_id},
  },
}) => {
  return {
    ledgerView,
    organization_id,
  };
};

// Export
//----------------------------------------------------------------------------
export default compose(
  connect(mapGraphStateToProps),
  graphql(EntriesQuery, {
    name: "entryQuery",
    options: (props) => {
      return {
        fetchPolicy: "network-only",
        skip: props.ledgerView === "detail",
        variables: {
          first: 35,
          organization_id: props.organization_id,
        },
      };
    },
  }),
  graphql(EntryItemsQuery, {
    name: "entryItemsQuery",
    options: (props) => {
      return {
        fetchPolicy: "network-only",
        skip: props.ledgerView === "summary",
        variables: {
          first: 35,
          organization_id: props.organization_id,
        },
      };
    },
  }),
  connect(mapStateToProps, mapDispatchToProps)
)(IndexView);

// Helper Functions
//------------------------------------------------------------------------------
const mergeFunc = (query) => (prevProps, nextProps) => {
  const {[query]: {nodes: prevNodes, pageInfo: prevPageInfo} = {}} = prevProps;
  const {
    fetchMoreResult: {
      [query]: {pageInfo: nextPageInfo},
    },
  } = nextProps;

  return prevPageInfo.endCursor === nextPageInfo.endCursor
    ? prevProps
    : produce(prevProps, (draft) => {
        const {fetchMoreResult: {[query]: {nodes, pageInfo}} = {}} = nextProps;

        draft[query].nodes = uniqBy([...prevNodes, ...nodes], "id");
        draft[query].pageInfo = pageInfo;
      });
};
