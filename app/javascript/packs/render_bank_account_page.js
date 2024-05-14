// import "../components/shared/why_did_you_update";

// Imports
//------------------------------------------------------------------------------
import {render} from "react-dom";
import merge from "lodash/merge";
import createSagaMiddleware from "redux-saga";
import {setupApolloClient, noop} from "../utils";
import {Suspense} from "react";
import HelmetProvider from "react-navi-helmet-async";
import {MuiPickersUtilsProvider as NewMuiPickersUtilsProvider} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

// HMR
import {AppContainer} from "react-hot-loader";

// Redux
import {Provider} from "react-redux";
import watchEntry from "../sagas/save_entry";

// Apollo
import {ApolloProvider} from "react-apollo";

// rematch
import {init} from "@rematch/core";

import {Router, View} from "react-navi";
import routes from "../components/bank_account/routes";

// Components
import StatementsIndex from "../components/reconciliations/index_view";
import statementRoutes from "../components/reconciliations/routes";
import BankAccountRouter from "../components/bank_account/router";
import statementModel from "../reducers/models/bank_account/statement.model";
import bankAccountModel from "../reducers/models/bank_account/bank_account.model";

import {
  StylesProvider,
  createGenerateClassName,
} from "@material-ui/core/styles";

const generateClassName = createGenerateClassName({
  productionPrefix: "bank-account-index",
  seed: ["bank-account-index", Math.random()].join("-"),
});

const sagaMiddleware = createSagaMiddleware();

// Configure Store
//------------------------------------------------------------------------------
const client = setupApolloClient();
const {account_data: filestack, permissions} = window.initial_data || {};

const initialState = merge(
  {
    bank: bankAccountModel.state,
  },
  {filestack, permissions}
);

// Set up rematch
const store = init({
  models: {
    statement: statementModel,
    bank: bankAccountModel,
  },
  redux: {
    initialState,
    reducers: {
      permissions: noop,
    },
    middlewares: [sagaMiddleware],
  },
});

// Run Saga
sagaMiddleware.run(watchEntry);

// Render Components
//------------------------------------------------------------------------------
const renderComponent = (Component) => {
  const elem = document.getElementById("bank_account_index");
  if (elem) {
    const {fiscalYear} = elem.dataset;

    store.dispatch({
      type: "bank/setAfterDateFilter",
      payload: `${parseInt(fiscalYear)}-07-01`,
    });

    store.dispatch({
      type: "statement/setFiscalYear",
      payload: fiscalYear,
    });

    // Render bank_accounts
    render(
      <AppContainer>
        <Provider store={store}>
          <NewMuiPickersUtilsProvider utils={DateFnsUtils}>
            <ApolloProvider client={client}>
              <HelmetProvider>
                <StylesProvider generateClassName={generateClassName}>
                  <Router
                    routes={routes}
                    basename="/bank_accounts"
                    context={{permissions}}
                  >
                    <Suspense fallback={null}>
                      <Component />
                    </Suspense>
                  </Router>
                </StylesProvider>
              </HelmetProvider>
            </ApolloProvider>
          </NewMuiPickersUtilsProvider>
        </Provider>
      </AppContainer>,
      elem
    );
  }

  const statementElem = document.getElementById("statements_index");
  if (statementElem) {
    render(
      <AppContainer>
        <ApolloProvider client={client}>
          <Router routes={statementRoutes} basename="/reconciliations">
            <Suspense fallback={null}>
              <Component />
            </Suspense>
          </Router>
        </ApolloProvider>
      </AppContainer>,
      statementElem
    );
  }
};

// Bank Account Page
document.addEventListener("DOMContentLoaded", () => {
  renderComponent(View);
});

// Update from HMR Calls
if (module.hot) {
  module.hot.accept("../components/bank_account/routes", () => {
    renderComponent(BankAccountRouter);
    window.history.go(window.location.href);
  });

  module.hot.accept("../components/reconciliations/routes", () => {
    renderComponent(StatementsIndex);
  });
}
