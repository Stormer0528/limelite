import {put, select, call, takeEvery} from "redux-saga/effects";
// import forEach from "lodash/forEach";
// import get from "lodash/get";

// Selectors
import {getSelectedAccount} from "../selectors/bank_items_selector";
import {startOfMonth, endOfMonth, format} from "date-fns/esm";

// Graphql
import {authenticityToken} from "../utils";
import {ApolloClient} from "apollo-client";
import {createHttpLink} from "apollo-link-http";
import {InMemoryCache} from "apollo-cache-inmemory";
import gql from "graphql-tag";

// GQL Queries
import findItemsQuery from "../graphql/queries/bank_account_search.gql";
import LoadStatementQuery from "../graphql/queries/load_statement.gql";
import createStatementMutation from "../graphql/mutations/create_statement.gql";
import updateStateMutation from "../graphql/mutations/update_state.gql";

import introspectionQueryResultData from "../fragments.json";
import {IntrospectionFragmentMatcher} from "apollo-cache-inmemory";

// const fetch = require("node-fetch");

// Set up client for graphql
const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData,
});

const client = new ApolloClient({
  link: createHttpLink({
    uri: "/graphql",
    headers: {
      "X-CSRF-Token": authenticityToken(),
    },
    credentials: "same-origin",
  }),
  cache: new InMemoryCache({fragmentMatcher}),
});

export default function* loadAccounts() {
  yield takeEvery("LOAD_STATEMENT", loadStatement);
  yield takeEvery("SAVE_STATEMENT", saveStatement);
  yield takeEvery("FIND_BANK_ITEMS_BY_DATE", findBankItemsByDate);
}

function* loadStatement({id: statement_id}) {
  const {
    data: {statement},
  } = yield client.query({
    query: LoadStatementQuery,
    variables: {
      statement_id,
    },
  });
  yield put({type: "statement/loadStatement", payload: statement});
  yield call(findBankItemsByDate, {update: true});
}

function* saveStatement({
  reconcilable_type = "BankAccount",
  reconcilable_id,
  statement_id,
  statement_balance,
  state_action,
}) {
  const {
    statement: {
      started_at = "",
      ended_at = "",
      starting_balance = null,
      ending_balance = null,
      selectedItems = [],
      file_url,
    },
  } = yield select((state) => state);
  const item_ids = Object.values(selectedItems)
    .map(({id}) => id)
    .join(",");

  const variables = {
    reconcilable_type,
    reconcilable_id,
    started_at,
    ended_at,
    file_url,
    state_action,
    starting_balance: `${starting_balance}`,
    ending_balance: `${ending_balance}`,
    item_ids,
    statement_id,
    adjustment_amount: `${statement_balance}`,
  };

  const {
    data: {
      createStatement: {id, errors = []},
    },
  } = yield client.mutate({
    mutation: createStatementMutation,
    variables,
  });
  // if (errors.length !== 0) {
  //   //Error Handling
  //   yield put({type: "SET_VALIDATION_ERRORS", errors});
  // } else {
  //   yield put({type: "TOGGLE_ACCOUNT_FINDER_OPEN"});
  //   yield put({type: "RESET_ENTRY"});
  // yield put({
  //   type: "SET_NOTIFICATION_MESSAGE",
  //   notificationMessage: "Statement Saved",
  // });

  yield call(
    setTimeout,
    () => {
      window.location = `/bank_accounts/${
        window.location.pathname.split("/")[2]
      }/statements/${id}`;
    },
    150
  );
  // yield put({type: "SET_NOTIFICATION_MESSAGE_OPEN", open: true});
  // }
}

function* findBankItemsByDate({update = false}) {
  let {
    accounts,
    statement: {started_at: start_date, ended_at: end_date},
  } = yield select(({statement, bank: {accounts}}) => ({statement, accounts}));

  const bankAccount = getSelectedAccount({
    accounts,
    account_id: window.location.pathname.split("/")[2],
  });

  if (start_date === "") {
    start_date = format(startOfMonth(end_date), "yyyy-MM-dd");
    yield put({type: "statement/setStartDate", payload: start_date});
  }

  if (end_date === "") {
    end_date = format(endOfMonth(start_date), "yyyy-MM-dd");
    yield put({type: "statement/setEndDate", payload: end_date});
  }

  // Get Items
  const {
    data: {bankItemSearch: checks},
  } = yield client.query({
    variables: {
      start_date,
      end_date,
      bank_account_id: bankAccount.id,
      reconciled: false,
      type: "BankAccount::Check",
    },
    query: findItemsQuery,
  });

  const {
    data: {bankItemSearch: deposits},
  } = yield client.query({
    variables: {
      start_date,
      end_date,
      bank_account_id: bankAccount.id,
      reconciled: false,
      type: "BankAccount::Deposit,BankAccount::AccountTransfer",
    },
    query: findItemsQuery,
  });

  // Get Last Statement Balance
  const {
    data: {bankAccountBalance: starting_balance},
  } = yield client.query({
    query: gql`
      query bankAccountBalance($id: ID!, $statementDate: String) {
        bankAccountBalance(id: $id, before_date: $statementDate)
      }
    `,
    variables: {
      id: bankAccount.id,
      statementDate: start_date,
    },
  });

  yield put({
    type: "statement/setStartingBalance",
    payload: starting_balance.toString(),
  });

  yield put({
    type: `statement/${update ? "update" : "set"}AvailableItems`,
    payload: {
      availableItems: [...deposits, ...checks],
      starting_balance,
    },
  });
}

function* transitionState({
  id,
  slug = "",
  nextState = "draft",
  modelType,
  save,
}) {
  const {
    data: {updateState},
  } = yield client.mutate({
    mutation: updateStateMutation,
    variables: {id, slug, nextState, modelType, save},
  });

  yield put({
    type: `${modelType}s/setUpdatedState`,
    payload: {id, slug, modelType, updateState},
  });
}

// Helper Methods
//------------------------------------------------------------------------------
// function setDefaults(defaults, entry, accounts) {
//   const ret = {};
//   const items = [
//     "fund",
//     "function",
//     "goal",
//     "location",
//     "object",
//     "resource",
//     "year",
//   ];
//   forEach(items, (element) => {
//     const key = `${element}s`;
//     const defaultValue = get(defaults, [key, "id"]);
//     ret[`${element}_id`] = entry[`${element}_id`]
//       ? findItemId(entry[`${element}_id`], accounts[key])
//       : defaultValue;
//   });

//   return ret;
// }

// function findItemId(code, collection) {
//   const {id} = find(collection, {code}) || {};
//   return id;
// }
