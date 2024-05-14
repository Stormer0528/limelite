import {put, select, call, takeEvery, throttle} from "redux-saga/effects";

import {startOfMonth, endOfMonth, format, addMonths} from "date-fns/esm";
import {ApolloClient} from "apollo-client";
import {createHttpLink} from "apollo-link-http";
import {InMemoryCache} from "apollo-cache-inmemory";
import gql from "graphql-tag";
import {IntrospectionFragmentMatcher} from "apollo-cache-inmemory";
import {logError} from "../utils";

// Selectors
import {getSelectedAccount} from "../selectors/bank_items_selector";
import {getSelectedAccount as getSelectedCreditCardAccount} from "../selectors/credit_card_items_selector";

// Graphql
import {authenticityToken} from "../utils";

// GQL Queries
import accountSearchQuery from "../graphql/queries/account_search.gql";
import createStatementMutation from "../graphql/mutations/create_statement.gql";
import findCreditCardItemsQuery from "../graphql/queries/credit_card_account_search.gql";
import findItemsQuery from "../graphql/queries/bank_account_search.gql";
import lastStatementBalanceQuery from "../graphql/queries/last_statement_balance.gql";
import LoadStatementQuery from "../graphql/queries/load_statement.gql";
import newAccountMutation from "../graphql/mutations/create_new_account.gql";
import updateStateMutation from "../graphql/mutations/update_state.gql";
import validateAccountQuery from "../graphql/queries/validate_account.gql";

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
  yield throttle(300, "FIND_ACCOUNTS_BY_CODE", findAccountsByCode);
  yield takeEvery("VALIDATE_ITEM_CODE", validateItemCode);
  yield takeEvery("CREATE_NEW_ACCOUNT", createNewAccount);
  yield takeEvery("CREATE_ACCOUNT_FINDER_ACCOUNT", createAccountFinderAccount);
  yield takeEvery("SET_CURRENT_ITEM_ACCOUNT", setCurrentItemAccount);
  yield takeEvery("LOAD_STATEMENT", loadStatement);
  yield takeEvery("LOAD_CREDIT_CARD_STATEMENT", loadCreditCardStatement);
  yield takeEvery("SAVE_STATEMENT", saveStatement);
  yield takeEvery("FIND_BANK_ITEMS_BY_DATE", findBankItemsByDate);
  yield takeEvery("FIND_CREDIT_CARD_ITEMS_BY_DATE", findCreditCardItemsByDate);
  yield takeEvery("TRANSITION_STATE", transitionState);
  yield takeEvery("FIND_UNRECONCILED_BANK_ITEMS", findUnreconciledBankItems);
  yield takeEvery("FIND_PRINTABLE_BANK_ITEMS", findPrintableBankItems);
  yield takeEvery("SET_STATEMENT_DATES", setStatementDates);
  yield takeEvery(
    "FIND_UNRECONCILED_CREDIT_CARD_ITEMS",
    findUnreconciledCreditCardItems
  );
}

function* setCurrentItemAccount({account}) {
  const {
    name: accountName,
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
        accountName,
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

function* validateItemCode({
  id,
  fundCode,
  functionCode,
  goalCode,
  locationCode,
  objectCode,
  resourceCode,
  yearCode,
}) {
  if (
    [
      fundCode,
      functionCode,
      goalCode,
      locationCode,
      objectCode,
      resourceCode,
      yearCode,
    ].filter((x) => !!x).length < 1
  ) {
    return;
  }

  try {
    const {
      data: {accountByNumber: account = false},
    } = yield client.query({
      variables: {
        name,
        fundCode,
        functionCode,
        goalCode,
        locationCode,
        objectCode,
        resourceCode,
        yearCode,
      },
      query: validateAccountQuery,
    });

    yield put({type: "entry/validateAccount", payload: {id, account}});
  } catch (err) {
    logError(err);
  }
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

function* loadStatement({id: statementId}) {
  yield put({type: "statement/setLoading", payload: true});
  const {
    data: {statement},
  } = yield client.query({
    query: LoadStatementQuery,
    variables: {
      statementId,
    },
  });

  yield put({type: "statement/loadStatement", payload: statement});

  // Set editable to false for show view
  if (
    window.location.pathname.split("/")[5] !== "edit" &&
    window.location.pathname.split("/")[4] !== "new"
  ) {
    yield put({type: "statement/setEditable", payload: false});
  }
  yield call(findBankItemsByDate, {update: true});
  yield put({type: "statement/setLoading", payload: false});
}

function* loadCreditCardStatement({id: statementId}) {
  const {
    data: {statement},
  } = yield client.query({
    query: LoadStatementQuery,
    variables: {
      statementId,
    },
  });

  yield put({type: "statement/loadStatement", payload: statement});
  yield call(findCreditCardItemsByDate, {update: true});
}

function* saveStatement({
  statement_id,
  statementable_id,
  statementable_type = "BankAccount",
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
  const item_ids = Object.values(selectedItems).map(({id}) => id);
  const variables = {
    statementable_id,
    statementable_type,
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

  const statementable_param =
    statementable_type === "CreditCard" ? "credit_cards" : "bank_accounts";

  yield call(
    setTimeout,
    () => {
      window.location = `/${statementable_param}/${
        window.location.pathname.split("/")[2]
      }/reconciliations/${id}`;
    },
    150
  );
}

function* findBankItemsByDate({update = false}) {
  let {
    statement: {started_at: start_date, ended_at: end_date},
  } = yield select(({statement, bank: {accounts}}) => ({
    statement,
    accounts,
  }));

  const urlSlug = window.location.pathname.split("/")[2];

  const {
    data: {
      bank_account: {id: bank_account_id},
    },
  } = yield client.query({
    query: gql`
      query {
        bank_account(slug: "${urlSlug}") {
          id
        }
      }
    `,
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
      // start_date,
      end_date,
      bank_account_id,
      approved: true,
      reconciled: false,
      type: "Check",
    },
    query: findItemsQuery,
  });

  const {
    data: {bankItemSearch: deposits},
  } = yield client.query({
    variables: {
      // start_date,
      end_date,
      bank_account_id,
      approved: true,
      reconciled: false,
      type: "Deposit",
    },
    query: findItemsQuery,
  });

  const {
    data: {bankItemSearch: transfers},
  } = yield client.query({
    variables: {
      // start_date,
      end_date,
      bank_account_id,
      approved: true,
      reconciled: false,
      type: "AccountTransfer",
    },
    query: findItemsQuery,
  });

  if (!update) {
    // Get Last Statement Balance
    const {
      data,
      data: {lastStatementBalance: starting_balance = ""},
    } = yield client.query({
      query: lastStatementBalanceQuery,
      variables: {
        id: bank_account_id,
        statementDate: start_date,
        statementableType: "bank_accounts",
      },
    });

    yield put({
      type: "statement/setStartingBalance",
      payload: starting_balance.toString(),
    });
  }

  yield put({
    type: `statement/${update ? "update" : "set"}AvailableItems`,
    payload: {
      availableItems: [...deposits, ...checks, ...transfers],
    },
  });
}

function* findUnreconciledBankItems({update = false}) {
  const {accounts} = yield select(({statement, bank: {accounts}}) => ({
    statement,
    accounts,
  }));

  const bankAccount = getSelectedAccount({
    accounts,
    account_id: window.location.pathname.split("/")[2],
  });

  // Get Items
  const {
    data: {bankItemSearch: checks},
  } = yield client.query({
    variables: {
      bank_account_id: bankAccount.id,
      reconciled: false,
      type: "Check",
    },
    query: findItemsQuery,
  });

  const {
    data: {bankItemSearch: deposits},
  } = yield client.query({
    variables: {
      bank_account_id: bankAccount.id,
      reconciled: false,
      type: "Deposit",
    },
    query: findItemsQuery,
  });

  const {
    data: {bankItemSearch: transfers},
  } = yield client.query({
    variables: {
      bank_account_id: bankAccount.id,
      reconciled: false,
      type: "AccountTransfer",
    },
    query: findItemsQuery,
  });

  yield put({
    type: `statement/${update ? "update" : "set"}AvailableItems`,
    payload: {
      availableItems: [...deposits, ...checks, ...transfers],
    },
  });
}

function* findUnreconciledCreditCardItems({update = false}) {
  const {accounts} = yield select(
    ({statement, credit_card: {accounts = []} = {}}) => ({
      statement,
      accounts,
    })
  );

  const creditCard = getSelectedCreditCardAccount({
    accounts,
    account_id: window.location.pathname.split("/")[2],
  });

  // Get Items
  const {
    data: {creditCardItemSearch: charges},
  } = yield client.query({
    variables: {
      credit_card_id: creditCard.id,
      reconciled: false,
      type: "Charge",
    },
    query: findCreditCardItemsQuery,
  });

  const {
    data: {creditCardItemSearch: payments},
  } = yield client.query({
    variables: {
      credit_card_id: creditCard.id,
      reconciled: false,
      type: "Payment",
    },
    query: findCreditCardItemsQuery,
  });

  yield put({
    type: `statement/${update ? "update" : "set"}AvailableItems`,
    payload: {
      availableItems: [...charges, ...payments],
    },
  });
}

function* findCreditCardItemsByDate({update = false}) {
  let {
    accounts,
    statement: {started_at: start_date, ended_at: end_date},
  } = yield select(({statement, credit_card: {accounts}}) => ({
    statement,
    accounts,
  }));

  const creditCard = getSelectedCreditCardAccount({
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
    data: {creditCardItemSearch: charges},
  } = yield client.query({
    variables: {
      start_date,
      end_date,
      credit_card_id: creditCard.id,
      reconciled: false,
      type: "Charge",
    },
    query: findCreditCardItemsQuery,
  });

  const {
    data: {creditCardItemSearch: payments},
  } = yield client.query({
    variables: {
      start_date,
      end_date,
      credit_card_id: creditCard.id,
      reconciled: false,
      type: "Payment",
    },
    query: findCreditCardItemsQuery,
  });

  if (!update) {
    // Get Last Statement Balance
    const {
      data: {lastStatementBalance: starting_balance = ""},
    } = yield client.query({
      query: lastStatementBalanceQuery,
      variables: {
        id: creditCard.id,
        statementDate: start_date,
        statementableType: "credit_cards",
      },
    });

    yield put({
      type: "statement/setStartingBalance",
      payload: starting_balance.toString(),
    });
  }

  yield put({
    type: `statement/${update ? "update" : "set"}AvailableItems`,
    payload: {
      availableItems: [...charges, ...payments],
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
    variables: {
      id,
      slug,
      nextState,
      modelType,
      save,
    },
  });

  yield put({
    type: `${modelType}s/setUpdatedState`,
    payload: {
      id,
      slug,
      modelType,
      updateState,
    },
  });
}

// Helper Methods
//------------------------------------------------------------------------------
function* setStatementDates({slug}) {
  let {started_at: start_date, ended_at: end_date} = yield select(
    ({statement}) => statement
  );

  if (start_date === "") {
    // Set to beginning of month from last statement balance
    try {
      let {
        data: {
          lastStatement: {endingBalance, endedAt: end_date = null} = {},
        } = {},
      } = yield client.query({
        variables: {
          slug,
          beforeDate: format(new Date(), "yyyy-MM-dd"),
          statementableType: "bank_accounts",
        },
        query: gql`
          query lastStatement(
            $slug: String!
            $beforeDate: String
            $statementableType: String!
          ) {
            lastStatement(
              slug: $slug
              before_date: $beforeDate
              statementable_type: $statementableType
            ) {
              endedAt
              endingBalance
            }
          }
        `,
      });

      if (end_date) {
        end_date = addMonths(new Date(end_date), 1);
        yield put({
          type: "statement/setEndDate",
          payload: format(endOfMonth(end_date), "yyyy-MM-dd"),
        });

        start_date = format(startOfMonth(end_date), "yyyy-MM-dd");
        yield put({type: "statement/setStartDate", payload: start_date});
      }

      yield put({
        type: "statement/setStartingBalance",
        payload: endingBalance,
      });
      yield put({type: "FIND_BANK_ITEMS_BY_DATE"});
    } catch (err) {
      logError(err);
    }
  }
}

function* findPrintableBankItems() {
  const {bank_account_id, start_date, end_date} = yield select(
    ({
      bank: {
        currentAccount: {id: bank_account_id},
      },
      printerConfiguration: {start_date, end_date},
    }) => ({
      bank_account_id,
      start_date: start_date && format(new Date(start_date), "yyyy-MM-dd"),
      end_date: end_date && format(new Date(end_date), "yyyy-MM-dd"),
    })
  );

  const {
    data: {bankItemSearch: checks},
  } = yield client.query({
    variables: {
      start_date,
      end_date,
      bank_account_id,
      aasm_state: "approved",
      type: "check",
    },
    query: findItemsQuery,
  });

  yield put({type: "LOAD_CHECKS", checks});
}
