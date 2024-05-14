import {put, select, takeEvery, throttle} from "redux-saga/effects";

import {ApolloClient} from "apollo-client";
import {createHttpLink} from "apollo-link-http";
import {InMemoryCache} from "apollo-cache-inmemory";
import {IntrospectionFragmentMatcher} from "apollo-cache-inmemory";
import {logError} from "../utils";

// Graphql
import {authenticityToken} from "../utils";

// GQL Queries
import accountSearchQuery from "../graphql/queries/account_search.gql";
import newAccountMutation from "../graphql/mutations/create_new_account.gql";
import introspectionQueryResultData from "../fragments.json";

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

export default function* watchEntry() {
  yield throttle(350, "FIND_ACCOUNTS_BY_CODE", findAccountsByCode);
  yield takeEvery("CREATE_NEW_ACCOUNT", createNewAccount);
  yield takeEvery("CREATE_ACCOUNT_FINDER_ACCOUNT", createAccountFinderAccount);
  yield takeEvery("SET_CURRENT_ITEM_ACCOUNT", setCurrentItemAccount);
}

function* setCurrentItemAccount({account}) {
  const {
    name,
    fundCode,
    functionCode,
    goalCode,
    objectCode,
    locationCode,
    resourceCode,
    yearCode,
    id: accountId,
  } = account;

  const id = yield select(({entry: {currentEntryIndex: id = 0}}) => id);

  yield put({
    type: "entry/updateCurrentEntryItem",
    payload: {
      entryItem: {
        name,
        fundCode,
        functionCode,
        goalCode,
        objectCode,
        locationCode,
        resourceCode,
        yearCode,
        accountId,
      },
      id,
    },
  });
}

function* findAccountsByCode() {
  const {
    selected: {
      name,
      fundId,
      functionId,
      goalId,
      locationId,
      objectId,
      resourceId,
      yearId,
    },
  } = yield select(({account_finder}) => account_finder);
  yield put({type: "account_finder/setLoading", payload: true});
  try {
    const {data: {accountSearch: accounts = []} = {}} = yield client.query({
      variables: {
        name,
        fundCode: fundId,
        functionCode: functionId,
        goalCode: goalId,
        locationCode: locationId,
        objectCode: objectId,
        resourceCode: resourceId,
        yearCode: yearId,
        timestamp: new Date().toISOString(),
      },
      query: accountSearchQuery,
    });
    yield put({type: "account_finder/setAccounts", payload: accounts});
  } catch (err) {
    logError(err);
  }
  yield put({type: "account_finder/setLoading", payload: false});
}

function* createAccountFinderAccount() {
  const id = yield select(
    ({entry: {currentEntryIndex: id = 0} = {}} = {}) => id
  );
  const name = yield select(
    ({
      account_finder: {
        selected: {name},
      },
    }) => name
  );
  const entryItem = yield select(
    ({
      account_finder: {
        selected: {
          fundId: fundCode,
          functionId: functionCode,
          goalId: goalCode,
          locationId: locationCode,
          objectId: objectCode,
          resourceId: resourceCode,
          yearId: yearCode,
        },
      },
    }) => ({
      fundCode,
      functionCode,
      goalCode,
      locationCode,
      objectCode,
      resourceCode,
      yearCode,
    })
  );

  yield put({
    type: "account_finder/setAccountModalName",
    payload: {name},
  });
  yield put({
    type: "entry/updateCurrentEntryItem",
    payload: {id, entryItem},
  });
  yield put({type: "account_finder/setAccountModalId", payload: id});
  yield put({type: "account_finder/setAccountModalOpen", payload: true});
}

function* createNewAccount() {
  const {
    account: {name, budget, id},
    entry: {
      fundCode,
      resourceCode,
      yearCode,
      goalCode,
      objectCode,
      functionCode,
      locationCode,
    },
  } = yield select(
    ({
      account_finder: {
        ui: {accountModal: account},
      },
      entry: {
        entryItems: {[account.id]: entry},
      },
    }) => ({account, entry})
  );

  try {
    const {
      data: {createAccount: entryItem},
    } = yield client.mutate({
      mutation: newAccountMutation,
      variables: {
        name,
        budget,
        fundCode,
        resourceCode,
        yearCode,
        goalCode,
        objectCode,
        functionCode,
        locationCode,
      },
    });

    if (entryItem.errors.length === 0) {
      // Close account modal
      yield put({
        type: "entry/updateCurrentEntryItem",
        payload: {
          entryItem,
          id,
        },
      });
      yield put({type: "account_finder/setAccountModalOpen", payload: false});
      yield put({type: "account_finder/resetAccountModal"});

      yield put({type: "FIND_ACCOUNTS_BY_CODE"});
      // Show notification bar
    } else {
      yield put({
        type: "account_finder/setAccountErrors",
        payload: {
          errors: entryItem.errors,
        },
      });
    }
  } catch (e) {
    alert(`There was an error processing your request \n${e}`);
    console.error(e);
  }
}
